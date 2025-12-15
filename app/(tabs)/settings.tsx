
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { colors as defaultColors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const NOTIFICATION_SETTINGS_KEY = '@smartstudy_notification_settings';

interface NotificationSettings {
  revisionReminders: boolean;
  eventReminders: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string;
}

export default function SettingsScreen() {
  const { user, signOut, updateUser } = useAuth();
  const { settings, setTextSize, getColors, getTextStyle } = useSettings();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    revisionReminders: false,
    eventReminders: false,
    dailyReminder: false,
    dailyReminderTime: '09:00',
  });
  const [notificationsPermission, setNotificationsPermission] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  // Get current colors
  const colors = getColors();

  useEffect(() => {
    if (user) {
      loadNotificationSettings();
      checkNotificationPermissions();
      setEditName(user.name);
      setProfileImage(user.avatar);
    }
  }, [user?.id]);

  // Log settings changes for debugging
  useEffect(() => {
    console.log('Current accessibility settings:', {
      textSize: settings.accessibility.textSize,
    });
  }, [settings.accessibility]);

  const loadNotificationSettings = async () => {
    try {
      const settingsJson = await AsyncStorage.getItem(`${NOTIFICATION_SETTINGS_KEY}_${user?.id}`);
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        setNotificationSettings(settings);
        console.log('Loaded notification settings');
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(`${NOTIFICATION_SETTINGS_KEY}_${user?.id}`, JSON.stringify(newSettings));
      console.log('Saved notification settings');
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const checkNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsPermission(status === 'granted');
    } catch (error) {
      console.error('Error checking notification permissions:', error);
    }
  };

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationsPermission(status === 'granted');
      
      if (status === 'granted') {
        Alert.alert('Success', 'Notification permissions granted');
      } else {
        Alert.alert('Permission Denied', 'Please enable notifications in your device settings');
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions');
    }
  };

  const handleToggleSetting = async (key: keyof NotificationSettings) => {
    if (!notificationsPermission && !notificationSettings[key]) {
      Alert.alert(
        'Notifications Disabled',
        'Please enable notifications to use this feature',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: requestNotificationPermissions },
        ]
      );
      return;
    }

    const newSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };
    setNotificationSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const saveProfile = () => {
    if (user) {
      updateUser({
        name: editName,
        avatar: profileImage,
      });
      setProfileModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    }
  };

  if (!user) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent, { backgroundColor: colors.background }]}>
        <IconSymbol
          ios_icon_name="gear"
          android_material_icon_name="settings"
          size={80}
          color={colors.textSecondary}
        />
        <Text style={[getTextStyle(commonStyles.subtitle), styles.notAuthTitle]}>
          Sign In Required
        </Text>
        <Text style={[getTextStyle(commonStyles.textSecondary), styles.notAuthText]}>
          Sign in to access settings
        </Text>
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[getTextStyle(styles.headerTitle), { color: colors.text }]}>Settings</Text>
          <Text style={[getTextStyle(commonStyles.textSecondary), { color: colors.textSecondary }]}>
            Customize your app experience
          </Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol
              ios_icon_name="person.circle.fill"
              android_material_icon_name="account-circle"
              size={24}
              color={colors.primary}
            />
            <Text style={[getTextStyle(styles.sectionTitle), { color: colors.text }]}>Profile</Text>
          </View>

          <TouchableOpacity
            style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setProfileModalVisible(true)}
          >
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.border }]}>
                  <IconSymbol
                    ios_icon_name="person.fill"
                    android_material_icon_name="person"
                    size={40}
                    color={colors.textSecondary}
                  />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={[getTextStyle(styles.profileName), { color: colors.text }]}>{user.name}</Text>
              <Text style={[getTextStyle(styles.profileEmail), { color: colors.textSecondary }]}>{user.email}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Accessibility Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol
              ios_icon_name="accessibility"
              android_material_icon_name="accessibility"
              size={24}
              color={colors.primary}
            />
            <Text style={[getTextStyle(styles.sectionTitle), { color: colors.text }]}>Accessibility</Text>
          </View>
          <Text style={[getTextStyle(styles.sectionDescription), { color: colors.textSecondary }]}>
            Customize the app to suit your needs
          </Text>

          <View style={[styles.settingsList, { backgroundColor: colors.card }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[getTextStyle(styles.settingTitle), { color: colors.text }]}>Text Size</Text>
                <Text style={[getTextStyle(styles.settingDescription), { color: colors.textSecondary }]}>
                  Current: {settings.accessibility.textSize}
                </Text>
              </View>
              <View style={styles.textSizeButtons}>
                {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.textSizeButton,
                      { backgroundColor: settings.accessibility.textSize === size ? colors.primary : colors.border },
                    ]}
                    onPress={() => setTextSize(size)}
                  >
                    <Text
                      style={[
                        styles.textSizeButtonText,
                        { color: settings.accessibility.textSize === size ? '#FFFFFF' : colors.textSecondary },
                      ]}
                    >
                      {size === 'extra-large' ? 'XL' : size.charAt(0).toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={24}
              color={colors.primary}
            />
            <Text style={[getTextStyle(styles.sectionTitle), { color: colors.text }]}>Calendar Notifications</Text>
          </View>
          <Text style={[getTextStyle(styles.sectionDescription), { color: colors.textSecondary }]}>
            Get notified about your revision schedule and upcoming events
          </Text>

          {!notificationsPermission && (
            <TouchableOpacity
              style={[styles.permissionBanner, { 
                backgroundColor: colors.warning + '15', 
                borderColor: colors.warning + '30',
                borderWidth: 2,
              }]}
              onPress={requestNotificationPermissions}
            >
              <IconSymbol
                ios_icon_name="exclamationmark.triangle.fill"
                android_material_icon_name="warning"
                size={20}
                color={colors.warning}
              />
              <View style={styles.permissionBannerContent}>
                <Text style={[getTextStyle(styles.permissionBannerTitle), { color: colors.text }]}>
                  Notifications Disabled
                </Text>
                <Text style={[getTextStyle(styles.permissionBannerText), { color: colors.textSecondary }]}>
                  Tap to enable notifications
                </Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}

          <View style={[styles.settingsList, { backgroundColor: colors.card }]}>
            <View style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[getTextStyle(styles.settingTitle), { color: colors.text }]}>Revision Reminders</Text>
                <Text style={[getTextStyle(styles.settingDescription), { color: colors.textSecondary }]}>
                  Get notified when it&apos;s time for scheduled revision sessions
                </Text>
              </View>
              <Switch
                value={notificationSettings.revisionReminders}
                onValueChange={() => handleToggleSetting('revisionReminders')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.border}
              />
            </View>

            <View style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[getTextStyle(styles.settingTitle), { color: colors.text }]}>Event Reminders</Text>
                <Text style={[getTextStyle(styles.settingDescription), { color: colors.textSecondary }]}>
                  Get notified about upcoming events and unavailable dates
                </Text>
              </View>
              <Switch
                value={notificationSettings.eventReminders}
                onValueChange={() => handleToggleSetting('eventReminders')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.border}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[getTextStyle(styles.settingTitle), { color: colors.text }]}>Daily Study Reminder</Text>
                <Text style={[getTextStyle(styles.settingDescription), { color: colors.textSecondary }]}>
                  Get a daily reminder to check your revision schedule
                </Text>
              </View>
              <Switch
                value={notificationSettings.dailyReminder}
                onValueChange={() => handleToggleSetting('dailyReminder')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol
              ios_icon_name="person.fill"
              android_material_icon_name="person"
              size={24}
              color={colors.primary}
            />
            <Text style={[getTextStyle(styles.sectionTitle), { color: colors.text }]}>Account</Text>
          </View>

          <View style={[styles.accountInfo, { backgroundColor: colors.card }]}>
            <View style={styles.accountInfoRow}>
              <Text style={[getTextStyle(styles.accountInfoLabel), { color: colors.textSecondary }]}>Email:</Text>
              <Text style={[getTextStyle(styles.accountInfoValue), { color: colors.text }]}>{user.email}</Text>
            </View>
            <View style={styles.accountInfoRow}>
              <Text style={[getTextStyle(styles.accountInfoLabel), { color: colors.textSecondary }]}>Plan:</Text>
              <Text style={[
                getTextStyle(styles.accountInfoValue),
                { color: user.isPremium ? '#FFD700' : colors.text }
              ]}>
                {user.isPremium ? 'Premium' : 'Free'}
              </Text>
            </View>
            <View style={styles.accountInfoRow}>
              <Text style={[getTextStyle(styles.accountInfoLabel), { color: colors.textSecondary }]}>Member Since:</Text>
              <Text style={[getTextStyle(styles.accountInfoValue), { color: colors.text }]}>
                {new Date(user.signupDate).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signOutButton, { 
              backgroundColor: colors.error + '15', 
              borderColor: colors.error + '30',
              borderWidth: 2,
            }]}
            onPress={handleSignOut}
          >
            <IconSymbol
              ios_icon_name="rectangle.portrait.and.arrow.right"
              android_material_icon_name="logout"
              size={20}
              color={colors.error}
            />
            <Text style={[getTextStyle(styles.signOutButtonText), { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={24}
              color={colors.primary}
            />
            <Text style={[getTextStyle(styles.sectionTitle), { color: colors.text }]}>About</Text>
          </View>

          <View style={[styles.appInfo, { backgroundColor: colors.card }]}>
            <Text style={[getTextStyle(styles.appInfoText), { color: colors.text }]}>SmartStudy AI v1.0.0</Text>
            <Text style={[getTextStyle(styles.appInfoSubtext), { color: colors.textSecondary }]}>
              AI-powered learning platform for GCSE & A-Level students
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[getTextStyle(styles.modalTitle), { color: colors.text }]}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <IconSymbol
                  ios_icon_name="xmark"
                  android_material_icon_name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.modalProfileImage} />
              ) : (
                <View style={[styles.modalProfileImagePlaceholder, { backgroundColor: colors.border }]}>
                  <IconSymbol
                    ios_icon_name="camera.fill"
                    android_material_icon_name="camera-alt"
                    size={40}
                    color={colors.textSecondary}
                  />
                  <Text style={[getTextStyle(styles.imagePickerText), { color: colors.textSecondary }]}>Tap to add photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Text style={[getTextStyle(styles.inputLabel), { color: colors.text }]}>Name</Text>
              <TextInput
                style={[
                  getTextStyle(styles.input), 
                  { 
                    backgroundColor: colors.background, 
                    borderColor: colors.border, 
                    color: colors.text,
                    borderWidth: 1,
                  }
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, { backgroundColor: colors.border }]}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={[getTextStyle(styles.modalButtonTextCancel), { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave, { backgroundColor: colors.primary }]}
                onPress={saveProfile}
              >
                <Text style={[getTextStyle(styles.modalButtonTextSave), { color: '#FFFFFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 0,
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
  },
  profileImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  profileImage: {
    width: 64,
    height: 64,
  },
  profileImagePlaceholder: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionBannerContent: {
    flex: 1,
  },
  permissionBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  permissionBannerText: {
    fontSize: 12,
  },
  settingsList: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  textSizeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  textSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSizeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  accountInfo: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  accountInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  accountInfoLabel: {
    fontSize: 14,
  },
  accountInfoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 13,
    textAlign: 'center',
  },
  notAuthTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthText: {
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  imagePickerButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  modalProfileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePickerText: {
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {},
  modalButtonSave: {},
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSave: {
    fontSize: 16,
    fontWeight: '600',
  },
});
