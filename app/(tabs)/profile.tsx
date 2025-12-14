
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLesson } from '@/contexts/LessonContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  const { lessons } = useLesson();

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
      'Unlock unlimited lessons, advanced AI explanations, exam simulator, and more!\n\nPremium features will be available via Apple Pay in a future update.',
      [{ text: 'OK' }]
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <IconSymbol
          ios_icon_name="person.circle"
          android_material_icon_name="account-circle"
          size={80}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.subtitle, styles.notAuthTitle]}>
          Not Signed In
        </Text>
        <Text style={[commonStyles.textSecondary, styles.notAuthText]}>
          Sign in to access your profile and settings
        </Text>
        <TouchableOpacity
          style={[buttonStyles.primary, styles.signInButton]}
          onPress={() => router.push('/auth/sign-in')}
        >
          <Text style={buttonStyles.textWhite}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalFlashcards = lessons.reduce((sum, lesson) => sum + lesson.flashcards.length, 0);
  const totalQuestions = lessons.reduce((sum, lesson) => sum + lesson.examQuestions.length, 0);

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileIcon}>
            <IconSymbol
              ios_icon_name="person.fill"
              android_material_icon_name="person"
              size={40}
              color={colors.primary}
            />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          {!user.isPremium && (
            <TouchableOpacity
              style={styles.premiumBanner}
              onPress={handleUpgradeToPremium}
            >
              <IconSymbol
                ios_icon_name="crown.fill"
                android_material_icon_name="workspace-premium"
                size={24}
                color={colors.highlight}
              />
              <View style={styles.premiumBannerText}>
                <Text style={styles.premiumBannerTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumBannerSubtitle}>
                  Unlock all features
                </Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <IconSymbol
                ios_icon_name="book.fill"
                android_material_icon_name="menu-book"
                size={32}
                color={colors.primary}
              />
              <Text style={styles.statValue}>{lessons.length}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statCard}>
              <IconSymbol
                ios_icon_name="rectangle.stack.fill"
                android_material_icon_name="style"
                size={32}
                color={colors.secondary}
              />
              <Text style={styles.statValue}>{totalFlashcards}</Text>
              <Text style={styles.statLabel}>Flashcards</Text>
            </View>
            <View style={styles.statCard}>
              <IconSymbol
                ios_icon_name="flame.fill"
                android_material_icon_name="local-fire-department"
                size={32}
                color={colors.accent}
              />
              <Text style={styles.statValue}>{user.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={32}
                color={colors.highlight}
              />
              <Text style={styles.statValue}>{user.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Settings</Text>
          
          <SettingsItem
            icon="palette"
            materialIcon="palette"
            title="Appearance"
            subtitle="Theme and display settings"
            onPress={() => Alert.alert('Coming Soon', 'Theme settings will be available soon!')}
          />
          
          <SettingsItem
            icon="bell"
            materialIcon="notifications"
            title="Notifications"
            subtitle="Manage your notifications"
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon!')}
          />
          
          <SettingsItem
            icon="accessibility"
            materialIcon="accessibility"
            title="Accessibility"
            subtitle="Font size, contrast, and more"
            onPress={() => Alert.alert('Coming Soon', 'Accessibility settings will be available soon!')}
          />
          
          <SettingsItem
            icon="chart.bar"
            materialIcon="bar-chart"
            title="Analytics"
            subtitle="View your progress and insights"
            onPress={() => Alert.alert('Coming Soon', 'Analytics will be available soon!')}
          />
          
          <SettingsItem
            icon="gear"
            materialIcon="settings"
            title="Study Preferences"
            subtitle="Customize your learning experience"
            onPress={() => Alert.alert('Coming Soon', 'Study preferences will be available soon!')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Account</Text>
          
          <SettingsItem
            icon="person.circle"
            materialIcon="account-circle"
            title="Edit Profile"
            subtitle="Update your information"
            onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon!')}
          />
          
          <SettingsItem
            icon="lock"
            materialIcon="lock"
            title="Security"
            subtitle="Password and 2FA settings"
            onPress={() => Alert.alert('Coming Soon', 'Security settings will be available soon!')}
          />
          
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={handleSignOut}
          >
            <View style={[styles.settingsIcon, styles.signOutIcon]}>
              <IconSymbol
                ios_icon_name="arrow.right.square"
                android_material_icon_name="logout"
                size={24}
                color={colors.error}
              />
            </View>
            <View style={styles.settingsContent}>
              <Text style={[styles.settingsTitle, styles.signOutText]}>Sign Out</Text>
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
          <Text style={styles.footerText}>SmartStudy AI v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for students</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const SettingsItem = ({
  icon,
  materialIcon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  materialIcon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.settingsIcon}>
      <IconSymbol
        ios_icon_name={icon}
        android_material_icon_name={materialIcon}
        size={24}
        color={colors.primary}
      />
    </View>
    <View style={styles.settingsContent}>
      <Text style={styles.settingsTitle}>{title}</Text>
      <Text style={styles.settingsSubtitle}>{subtitle}</Text>
    </View>
    <IconSymbol
      ios_icon_name="chevron.right"
      android_material_icon_name="chevron-right"
      size={20}
      color={colors.textSecondary}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 0,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
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
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  settingsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutIcon: {
    backgroundColor: colors.error + '10',
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  signOutText: {
    color: colors.error,
  },
  settingsSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
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
    marginBottom: 24,
  },
  signInButton: {
    minWidth: 200,
  },
});
