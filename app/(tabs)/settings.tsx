
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Subject } from '@/types/lesson';

const AVAILABLE_SUBJECTS: Subject[] = [
  'Mathematics',
  'English Language',
  'English Literature',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Computer Science',
  'Business Studies',
  'Economics',
  'Psychology',
  'Sociology',
  'Art & Design',
  'Music',
  'Drama',
  'Physical Education',
  'Religious Studies',
  'French',
  'Spanish',
  'German',
  'Media Studies',
  'Design & Technology',
  'Food Technology',
  'BTEC Business',
  'BTEC Sport',
  'BTEC Health & Social Care',
  'BTEC IT',
  'BTEC Engineering',
  'BTEC Applied Science',
];

const AVATAR_OPTIONS = ['👤', '😊', '🎓', '📚', '🌟', '🚀', '🎯', '💡', '🏆', '🎨', '🎵', '⚽'];

export default function SettingsScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, signOut, updateUser } = useAuth();
  const {
    settings,
    toggleDyslexiaFont,
    toggleDarkMode,
    toggleHighContrast,
    toggleNotifications,
    setTextSize,
    setDefaultDifficulty,
    setDefaultSubjects,
    toggleStudySounds,
    setCustomColors,
    getTextSizeMultiplier,
  } = useSettings();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showTextSize, setShowTextSize] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [showCustomColors, setShowCustomColors] = useState(false);

  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(settings.study.defaultSubjects);
  const [customPrimary, setCustomPrimary] = useState('#7451EB');
  const [customSecondary, setCustomSecondary] = useState('#A892FF');
  const [customAccent, setCustomAccent] = useState('#FF6F61');

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
            console.log('Sign out button pressed in settings');
            try {
              await signOut();
              console.log('Sign out completed successfully');
            } catch (error) {
              console.error('Error during sign out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
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

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    updateUser({ name: editName, email: editEmail });
    setShowEditProfile(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowSecurity(false);
    Alert.alert('Success', 'Password changed successfully!');
  };

  const handleSelectAvatar = (avatar: string) => {
    updateUser({ avatar });
    setShowAvatar(false);
    Alert.alert('Success', 'Avatar updated!');
  };

  const handleSaveSubjects = () => {
    setDefaultSubjects(selectedSubjects);
    setShowSubjects(false);
    Alert.alert('Success', 'Default subjects updated!');
  };

  const handleSaveCustomColors = () => {
    setCustomColors({
      primary: customPrimary,
      secondary: customSecondary,
      accent: customAccent,
    });
    setShowCustomColors(false);
    Alert.alert('Success', 'Custom colors applied!');
  };

  const handleResetColors = () => {
    setCustomColors(null);
    setShowCustomColors(false);
    Alert.alert('Success', 'Colors reset to default!');
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
  const textMultiplier = getTextSizeMultiplier();

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
            { color: textColor, fontSize: 28 * textMultiplier }
          ]}>
            Settings
          </Text>
          <Text style={[
            commonStyles.textSecondary,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 14 * textMultiplier }
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
                { color: textColor, fontSize: 16 * textMultiplier }
              ]}>
                Admin Panel
              </Text>
              <Text style={[
                styles.adminBannerSubtitle,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { fontSize: 13 * textMultiplier }
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
                { color: textColor, fontSize: 16 * textMultiplier }
              ]}>
                Upgrade to Premium
              </Text>
              <Text style={[
                styles.premiumBannerSubtitle,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { fontSize: 13 * textMultiplier }
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
            { color: textColor, fontSize: 18 * textMultiplier }
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Dyslexia-Friendly Font
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
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
            onPress={() => setShowTextSize(true)}
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Text Size
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  High Contrast
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
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
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 18 * textMultiplier }
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Dark Mode
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
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
            onPress={() => setShowCustomColors(true)}
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Custom Colors
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
                ]}>
                  {settings.theme.customColors ? 'Custom theme active' : 'Personalize your theme'}
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
                ios_icon_name="speaker.wave.2"
                android_material_icon_name="volume-up"
                size={20}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Study Sounds
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
                ]}>
                  Background music & ambience
                </Text>
              </View>
            </View>
            <Switch
              value={settings.theme.studySounds}
              onValueChange={toggleStudySounds}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 18 * textMultiplier }
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Task Alerts
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Exam Reminders
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  AI Study Reminders
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
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
            { color: textColor, fontSize: 18 * textMultiplier }
          ]}>
            Study Preferences
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => setShowDifficulty(true)}
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Default Difficulty
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
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
            onPress={() => setShowSubjects(true)}
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Default Subjects
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
                ]}>
                  {settings.study.defaultSubjects.length > 0 
                    ? `${settings.study.defaultSubjects.length} selected` 
                    : 'Choose your main subjects'}
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
            { color: textColor, fontSize: 18 * textMultiplier }
          ]}>
            Gamification
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => setShowBadges(true)}
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Badges & Achievements
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
                ]}>
                  {user?.badges.length || 0} badges earned
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
            onPress={() => setShowAvatar(true)}
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Avatar
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
                ]}>
                  {user?.avatar || 'Customize your profile'}
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
            { color: textColor, fontSize: 18 * textMultiplier }
          ]}>
            Account
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBg }]}
            onPress={() => {
              setEditName(user?.name || '');
              setEditEmail(user?.email || '');
              setShowEditProfile(true);
            }}
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Edit Profile
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
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
            onPress={() => setShowSecurity(true)}
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
                  { color: textColor, fontSize: 15 * textMultiplier }
                ]}>
                  Security
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
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
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 15 * textMultiplier }
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
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { fontSize: 12 * textMultiplier }
          ]}>
            SmartStudy AI v1.0.0
          </Text>
          <Text style={[
            styles.footerText,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { fontSize: 12 * textMultiplier }
          ]}>
            Made with ❤️ for students
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Edit Profile</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: colors.border }]}
              placeholder="Name"
              placeholderTextColor={colors.textSecondary}
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={[styles.input, { color: textColor, borderColor: colors.border }]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowEditProfile(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveProfile}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Security Modal */}
      <Modal visible={showSecurity} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Change Password</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: colors.border }]}
              placeholder="Current Password"
              placeholderTextColor={colors.textSecondary}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { color: textColor, borderColor: colors.border }]}
              placeholder="New Password"
              placeholderTextColor={colors.textSecondary}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { color: textColor, borderColor: colors.border }]}
              placeholder="Confirm New Password"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowSecurity(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleChangePassword}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Modal */}
      <Modal visible={showAvatar} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Choose Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.avatarOption,
                    user?.avatar === avatar && styles.avatarOptionSelected,
                  ]}
                  onPress={() => handleSelectAvatar(avatar)}
                >
                  <Text style={styles.avatarEmoji}>{avatar}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel, { width: '100%' }]}
              onPress={() => setShowAvatar(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Badges Modal */}
      <Modal visible={showBadges} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Your Badges</Text>
            <ScrollView style={styles.badgesList}>
              {user?.badges && user.badges.length > 0 ? (
                user.badges.map((badge, index) => (
                  <View key={index} style={[styles.badgeItem, { backgroundColor: colors.secondary + '20' }]}>
                    <IconSymbol
                      ios_icon_name="rosette"
                      android_material_icon_name="emoji-events"
                      size={24}
                      color={colors.highlight}
                    />
                    <Text style={[styles.badgeText, { color: textColor }]}>{badge}</Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No badges earned yet. Keep studying to unlock achievements!
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel, { width: '100%' }]}
              onPress={() => setShowBadges(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Text Size Modal */}
      <Modal visible={showTextSize} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Text Size</Text>
            {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionItem,
                  settings.accessibility.textSize === size && styles.optionItemSelected,
                ]}
                onPress={() => {
                  setTextSize(size);
                  setShowTextSize(false);
                }}
              >
                <Text style={[styles.optionText, { color: textColor }]}>
                  {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                </Text>
                {settings.accessibility.textSize === size && (
                  <IconSymbol
                    ios_icon_name="checkmark"
                    android_material_icon_name="check"
                    size={20}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel, { width: '100%', marginTop: 16 }]}
              onPress={() => setShowTextSize(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Difficulty Modal */}
      <Modal visible={showDifficulty} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Default Difficulty</Text>
            {(['Easy', 'Normal', 'Hard'] as const).map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.optionItem,
                  settings.study.defaultDifficulty === difficulty && styles.optionItemSelected,
                ]}
                onPress={() => {
                  setDefaultDifficulty(difficulty);
                  setShowDifficulty(false);
                }}
              >
                <Text style={[styles.optionText, { color: textColor }]}>{difficulty}</Text>
                {settings.study.defaultDifficulty === difficulty && (
                  <IconSymbol
                    ios_icon_name="checkmark"
                    android_material_icon_name="check"
                    size={20}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel, { width: '100%', marginTop: 16 }]}
              onPress={() => setShowDifficulty(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Subjects Modal */}
      <Modal visible={showSubjects} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg, maxHeight: '80%' }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Default Subjects</Text>
            <ScrollView style={styles.subjectsList}>
              {AVAILABLE_SUBJECTS.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.optionItem,
                    selectedSubjects.includes(subject) && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    if (selectedSubjects.includes(subject)) {
                      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
                    } else {
                      setSelectedSubjects([...selectedSubjects, subject]);
                    }
                  }}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>{subject}</Text>
                  {selectedSubjects.includes(subject) && (
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setSelectedSubjects(settings.study.defaultSubjects);
                  setShowSubjects(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveSubjects}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Colors Modal */}
      <Modal visible={showCustomColors} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Custom Colors</Text>
            <Text style={[styles.colorLabel, { color: textColor }]}>Primary Color</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: colors.border }]}
              placeholder="#7451EB"
              placeholderTextColor={colors.textSecondary}
              value={customPrimary}
              onChangeText={setCustomPrimary}
            />
            <Text style={[styles.colorLabel, { color: textColor }]}>Secondary Color</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: colors.border }]}
              placeholder="#A892FF"
              placeholderTextColor={colors.textSecondary}
              value={customSecondary}
              onChangeText={setCustomSecondary}
            />
            <Text style={[styles.colorLabel, { color: textColor }]}>Accent Color</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: colors.border }]}
              placeholder="#FF6F61"
              placeholderTextColor={colors.textSecondary}
              value={customAccent}
              onChangeText={setCustomAccent}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleResetColors}
              >
                <Text style={styles.modalButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveCustomColors}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Apply</Text>
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
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.border,
  },
  modalButtonSave: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  badgesList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  optionItemSelected: {
    backgroundColor: colors.primary + '20',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  subjectsList: {
    maxHeight: 400,
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
});
