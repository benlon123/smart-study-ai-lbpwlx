
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const { settings, toggleDyslexiaFont, toggleDarkMode, toggleHighContrast, toggleNotifications } = useSettings();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(tabs)/(home)/');
          },
        },
      ]
    );
  };

  const handleUpgradeToPremium = () => {
    Alert.alert(
      'Premium Features',
      'Unlock unlimited lessons, advanced AI explanations, exam simulator, offline mode, and more!\n\nPremium features will be available via Apple Pay.',
      [{ text: 'OK' }]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <IconSymbol
          ios_icon_name="gearshape"
          android_material_icon_name="settings"
          size={80}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.subtitle, styles.notAuthTitle]}>
          Sign In Required
        </Text>
        <Text style={[commonStyles.textSecondary, styles.notAuthText]}>
          Sign in to access settings and customization
        </Text>
      </View>
    );
  }

  const containerStyle = settings.theme.mode === 'dark'
    ? [commonStyles.container, styles.darkContainer]
    : commonStyles.container;

  const textColor = settings.theme.mode === 'dark' ? '#FFFFFF' : colors.text;
  const cardBg = settings.theme.mode === 'dark' ? '#1a1a1a' : colors.card;

  return (
    <View style={containerStyle}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[
            styles.headerTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor }
          ]}>
            Settings
          </Text>
          <Text style={[
            commonStyles.textSecondary,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor }
          ]}>
            Customize your learning experience
          </Text>
        </View>

        {isAdmin && (
          <TouchableOpacity
            style={[styles.adminBanner, { backgroundColor: cardBg }]}
            onPress={() => router.push('/(tabs)/admin')}
          >
            <IconSymbol
              ios_icon_name="shield.fill"
              android_material_icon_name="admin-panel-settings"
              size={28}
              color={colors.primary}
            />
            <View style={styles.adminBannerText}>
              <Text style={[
                styles.adminBannerTitle,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { color: textColor }
              ]}>
                Admin Panel
              </Text>
              <Text style={[
                styles.adminBannerSubtitle,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont
              ]}>
                Manage users, premium features & app settings
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={textColor}
            />
          </TouchableOpacity>
        )}

        {!user?.isPremium && (
          <TouchableOpacity
            style={[styles.premiumBanner, { backgroundColor: cardBg }]}
            onPress={handleUpgradeToPremium}
          >
            <IconSymbol
              ios_icon_name="crown.fill"
              android_material_icon_name="workspace-premium"
              size={28}
              color={colors.highlight}
            />
            <View style={styles.premiumBannerText}>
              <Text style={[
                styles.premiumBannerTitle,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { color: textColor }
              ]}>
                Upgrade to Premium
              </Text>
              <Text style={[
                styles.premiumBannerSubtitle,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont
              ]}>
                Unlock all features & unlimited lessons
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={textColor}
            />
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor }
          ]}>
            Accessibility
          </Text>
          
          <View style={[styles.settingItem, { backgroundColor: cardBg }]}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="textformat"
                android_material_icon_name="text-fields"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Dyslexia-Friendly Font
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Easier to read font style
                </Text>
              </View>
            </View>
            <Switch
              value={settings.accessibility.dyslexiaFont}
              onValueChange={toggleDyslexiaFont}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Text Size', 'Text size adjustment coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="textformat.size"
                android_material_icon_name="format-size"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Text Size
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  {settings.accessibility.textSize}
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <View style={[styles.settingItem, { backgroundColor: cardBg }]}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="circle.lefthalf.filled"
                android_material_icon_name="contrast"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  High Contrast
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Improve visibility
                </Text>
              </View>
            </View>
            <Switch
              value={settings.accessibility.highContrast}
              onValueChange={toggleHighContrast}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Voice Commands', 'Voice commands coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="mic"
                android_material_icon_name="mic"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Voice Commands
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Control with your voice
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor }
          ]}>
            Theme
          </Text>
          
          <View style={[styles.settingItem, { backgroundColor: cardBg }]}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="moon.fill"
                android_material_icon_name="dark-mode"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Dark Mode
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Reduce eye strain
                </Text>
              </View>
            </View>
            <Switch
              value={settings.theme.mode === 'dark'}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Custom Colors', 'Color customization coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="paintpalette"
                android_material_icon_name="palette"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Custom Colors
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Personalize your theme
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Study Sounds', 'Study sounds coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="speaker.wave.2"
                android_material_icon_name="volume-up"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Study Sounds
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Background music & ambience
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor }
          ]}>
            Notifications
          </Text>
          
          <View style={[styles.settingItem, { backgroundColor: cardBg }]}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="bell.fill"
                android_material_icon_name="notifications"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Task Alerts
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Remind me about tasks
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notifications.taskAlerts}
              onValueChange={() => toggleNotifications('taskAlerts')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: cardBg }]}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="calendar"
                android_material_icon_name="event"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Exam Reminders
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Never miss an exam
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notifications.examReminders}
              onValueChange={() => toggleNotifications('examReminders')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: cardBg }]}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="sparkles"
                android_material_icon_name="auto-awesome"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  AI Study Reminders
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Smart study suggestions
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notifications.aiStudyReminders}
              onValueChange={() => toggleNotifications('aiStudyReminders')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor }
          ]}>
            Study Preferences
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Default Difficulty', 'Difficulty settings coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="slider.horizontal.3"
                android_material_icon_name="tune"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Default Difficulty
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  {settings.study.defaultDifficulty}
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Session Length', 'Session settings coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="clock"
                android_material_icon_name="schedule"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Session Length
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  {settings.study.sessionLength} minutes (Pomodoro)
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Default Subjects', 'Subject preferences coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="book"
                android_material_icon_name="menu-book"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Default Subjects
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Choose your main subjects
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor }
          ]}>
            Gamification
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Badges', 'Badge settings coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="rosette"
                android_material_icon_name="emoji-events"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Badges & Achievements
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Show my progress
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Avatar', 'Avatar customization coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="person.circle"
                android_material_icon_name="account-circle"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Avatar
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Customize your profile
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor }
          ]}>
            Account
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="person"
                android_material_icon_name="person"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Edit Profile
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Update your information
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Security', 'Security settings coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="lock"
                android_material_icon_name="lock"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Security
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Password & 2FA
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => Alert.alert('Backup & Restore', 'Backup settings coming soon!')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="icloud"
                android_material_icon_name="cloud"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor }
                ]}>
                  Backup & Restore
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Cloud sync
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.signOutItem, { backgroundColor: cardBg }]}
            onPress={handleSignOut}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="arrow.right.square"
                android_material_icon_name="logout"
                size={20}
                color={colors.error}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  styles.signOutText,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  Sign Out
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[
            styles.footerText,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont
          ]}>
            SmartStudy AI v1.0.0
          </Text>
          <Text style={[
            styles.footerText,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont
          ]}>
            Made with ❤️ for students
          </Text>
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
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  adminBannerText: {
    flex: 1,
  },
  adminBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  adminBannerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
    borderWidth: 2,
    borderColor: colors.highlight + '30',
  },
  premiumBannerText: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  premiumBannerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  signOutItem: {
    marginTop: 8,
  },
  signOutText: {
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notAuthTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthText: {
    textAlign: 'center',
  },
  dyslexiaFont: {
    fontFamily: 'OpenDyslexic',
  },
});
