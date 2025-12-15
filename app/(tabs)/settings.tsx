
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
import { colors, commonStyles } from '@/styles/commonStyles';
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
  const { settings, toggleDyslexiaFont, toggleHighContrast, setTextSize, toggleStudySounds, setCustomColors } = useSettings();
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

  useEffect(() => {
    if (user) {
      loadNotificationSettings();
      checkNotificationPermissions();
      setEditName(user.name);
      setProfileImage(user.avatar);
    }
  }, [user?.id]);

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
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <IconSymbol
          ios_icon_name="gear"
          android_material_icon_name="settings"
          size={80}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.subtitle, styles.notAuthTitle]}>
          Sign In Required
        </Text>
        <Text style={[commonStyles.textSecondary, styles.notAuthText]}>
          Sign in to access settings
        </Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={commonStyles.textSecondary}>
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
            <Text style={styles.sectionTitle}>Profile</Text>
          </View>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => setProfileModalVisible(true)}
          >
            <View style={styles.profileImageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
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
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
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
            <Text style={styles.sectionTitle}>Accessibility</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Customize the app to suit your needs
          </Text>

          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Dyslexia-Friendly Font</Text>
                <Text style={styles.settingDescription}>
                  Use OpenDyslexic font for easier reading
                </Text>
              </View>
              <Switch
                value={settings.accessibility.dyslexiaFont}
                onValueChange={toggleDyslexiaFont}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>High Contrast</Text>
                <Text style={styles.settingDescription}>
                  Increase contrast for better visibility
                </Text>
              </View>
              <Switch
                value={settings.accessibility.highContrast}
                onValueChange={toggleHighContrast}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Text Size</Text>
                <Text style={styles.settingDescription}>
                  Current: {settings.accessibility.textSize}
                </Text>
              </View>
              <View style={styles.textSizeButtons}>
                {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.textSizeButton,
                      settings.accessibility.textSize === size && styles.textSizeButtonActive,
                    ]}
                    onPress={() => setTextSize(size)}
                  >
                    <Text
                      style={[
                        styles.textSizeButtonText,
                        settings.accessibility.textSize === size && styles.textSizeButtonTextActive,
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

        {/* Theme Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol
              ios_icon_name="paintbrush.fill"
              android_material_icon_name="palette"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.sectionTitle}>Theme</Text>
          </View>

          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Study Sounds</Text>
                <Text style={styles.settingDescription}>
                  Play ambient sounds while studying
                </Text>
              </View>
              <Switch
                value={settings.theme.studySounds}
                onValueChange={toggleStudySounds}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Eye Strain Reduction</Text>
                <Text style={styles.settingDescription}>
                  Reduce blue light for comfortable reading
                </Text>
              </View>
              <Switch
                value={settings.theme.eyeStrainReduction}
                onValueChange={() => {
                  // Toggle eye strain reduction
                  console.log('Eye strain reduction toggled');
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
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
            <Text style={styles.sectionTitle}>Calendar Notifications</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Get notified about your revision schedule and upcoming events
          </Text>

          {!notificationsPermission && (
            <TouchableOpacity
              style={styles.permissionBanner}
              onPress={requestNotificationPermissions}
            >
              <IconSymbol
                ios_icon_name="exclamationmark.triangle.fill"
                android_material_icon_name="warning"
                size={20}
                color={colors.warning}
              />
              <View style={styles.permissionBannerContent}>
                <Text style={styles.permissionBannerTitle}>
                  Notifications Disabled
                </Text>
                <Text style={styles.permissionBannerText}>
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

          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Revision Reminders</Text>
                <Text style={styles.settingDescription}>
                  Get notified when it&apos;s time for scheduled revision sessions
                </Text>
              </View>
              <Switch
                value={notificationSettings.revisionReminders}
                onValueChange={() => handleToggleSetting('revisionReminders')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Event Reminders</Text>
                <Text style={styles.settingDescription}>
                  Get notified about upcoming events and unavailable dates
                </Text>
              </View>
              <Switch
                value={notificationSettings.eventReminders}
                onValueChange={() => handleToggleSetting('eventReminders')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Daily Study Reminder</Text>
                <Text style={styles.settingDescription}>
                  Get a daily reminder to check your revision schedule
                </Text>
              </View>
              <Switch
                value={notificationSettings.dailyReminder}
                onValueChange={() => handleToggleSetting('dailyReminder')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
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
            <Text style={styles.sectionTitle}>Account</Text>
          </View>

          <View style={styles.accountInfo}>
            <View style={styles.accountInfoRow}>
              <Text style={styles.accountInfoLabel}>Email:</Text>
              <Text style={styles.accountInfoValue}>{user.email}</Text>
            </View>
            <View style={styles.accountInfoRow}>
              <Text style={styles.accountInfoLabel}>Plan:</Text>
              <Text style={[
                styles.accountInfoValue,
                user.isPremium && styles.premiumText
              ]}>
                {user.isPremium ? 'Premium' : 'Free'}
              </Text>
            </View>
            <View style={styles.accountInfoRow}>
              <Text style={styles.accountInfoLabel}>Member Since:</Text>
              <Text style={styles.accountInfoValue}>
                {new Date(user.signupDate).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <IconSymbol
              ios_icon_name="rectangle.portrait.and.arrow.right"
              android_material_icon_name="logout"
              size={20}
              color={colors.error}
            />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
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
            <Text style={styles.sectionTitle}>About</Text>
          </View>

          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>SmartStudy AI v1.0.0</Text>
            <Text style={styles.appInfoSubtext}>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
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
                <View style={styles.modalProfileImagePlaceholder}>
                  <IconSymbol
                    ios_icon_name="camera.fill"
                    android_material_icon_name="camera-alt"
                    size={40}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.imagePickerText}>Tap to add photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={saveProfile}
              >
                <Text style={styles.modalButtonTextSave}>Save</Text>
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
    color: colors.text,
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
    color: colors.text,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  profileImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.warning + '15',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.warning + '30',
    marginBottom: 16,
  },
  permissionBannerContent: {
    flex: 1,
  },
  permissionBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  permissionBannerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  settingsList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  textSizeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  textSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSizeButtonActive: {
    backgroundColor: colors.primary,
  },
  textSizeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  textSizeButtonTextActive: {
    color: '#FFFFFF',
  },
  accountInfo: {
    backgroundColor: colors.card,
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
    color: colors.textSecondary,
  },
  accountInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  premiumText: {
    color: '#FFD700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.error + '15',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.error + '30',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  appInfo: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
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
    backgroundColor: colors.card,
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
    color: colors.text,
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
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePickerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
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
  modalButtonCancel: {
    backgroundColor: colors.border,
  },
  modalButtonSave: {
    backgroundColor: colors.primary,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalButtonTextSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
