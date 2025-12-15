
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, signOut } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    revisionReminders: false,
    eventReminders: false,
    dailyReminder: false,
    dailyReminderTime: '09:00',
  });
  const [notificationsPermission, setNotificationsPermission] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotificationSettings();
      checkNotificationPermissions();
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
});
