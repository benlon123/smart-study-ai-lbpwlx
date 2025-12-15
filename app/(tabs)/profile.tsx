
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
import { useSettings } from '@/contexts/SettingsContext';
import { useSuperwall } from '@/contexts/SuperwallContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { lessons } = useLesson();
  const { settings, getTextSizeMultiplier } = useSettings();
  const { purchasePremium, restorePurchases, isInitialized } = useSuperwall();

  const handleUpgradeToPremium = async () => {
    if (!isInitialized) {
      Alert.alert(
        'Please Wait',
        'Payment system is initializing. Please try again in a moment.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Upgrade to Premium',
      'Unlock unlimited lessons, advanced AI explanations, exam simulator, offline mode, and more!\n\nProduct ID: SmartstudyPremium',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore Purchases', 
          style: 'default',
          onPress: restorePurchases
        },
        { 
          text: 'Purchase', 
          style: 'default',
          onPress: purchasePremium
        },
      ]
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
          <View style={[styles.profileIcon, { backgroundColor: colors.secondary + '30' }]}>
            {user.avatar ? (
              <Text style={styles.avatarEmoji}>{user.avatar}</Text>
            ) : (
              <IconSymbol
                ios_icon_name="person.fill"
                android_material_icon_name="person"
                size={40}
                color={colors.primary}
              />
            )}
          </View>
          <Text style={[
            styles.userName,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 24 * textMultiplier }
          ]}>
            {user.name}
          </Text>
          <Text style={[
            styles.userEmail,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: colors.textSecondary, fontSize: 14 * textMultiplier }
          ]}>
            {user.email}
          </Text>
          
          {!user.isPremium && (
            <TouchableOpacity
              style={[styles.premiumBanner, { backgroundColor: cardBg }]}
              onPress={handleUpgradeToPremium}
            >
              <IconSymbol
                ios_icon_name="crown.fill"
                android_material_icon_name="workspace-premium"
                size={24}
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
                  Unlock all features with Apple Pay
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

          {user.isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: colors.highlight + '20' }]}>
              <IconSymbol
                ios_icon_name="crown.fill"
                android_material_icon_name="workspace-premium"
                size={20}
                color={colors.highlight}
              />
              <Text style={[
                styles.premiumBadgeText,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { color: colors.highlight, fontSize: 14 * textMultiplier }
              ]}>
                Premium Member
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={[
            commonStyles.subtitle,
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 20 * textMultiplier }
          ]}>
            Your Stats
          </Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: cardBg }]}>
              <IconSymbol
                ios_icon_name="book.fill"
                android_material_icon_name="menu-book"
                size={32}
                color={colors.primary}
              />
              <Text style={[
                styles.statValue,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { color: textColor, fontSize: 28 * textMultiplier }
              ]}>
                {lessons.length}
              </Text>
              <Text style={[
                styles.statLabel,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { fontSize: 13 * textMultiplier }
              ]}>
                Lessons
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: cardBg }]}>
              <IconSymbol
                ios_icon_name="rectangle.stack.fill"
                android_material_icon_name="style"
                size={32}
                color={colors.secondary}
              />
              <Text style={[
                styles.statValue,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { color: textColor, fontSize: 28 * textMultiplier }
              ]}>
                {totalFlashcards}
              </Text>
              <Text style={[
                styles.statLabel,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { fontSize: 13 * textMultiplier }
              ]}>
                Flashcards
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: cardBg }]}>
              <IconSymbol
                ios_icon_name="flame.fill"
                android_material_icon_name="local-fire-department"
                size={32}
                color={colors.accent}
              />
              <Text style={[
                styles.statValue,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { color: textColor, fontSize: 28 * textMultiplier }
              ]}>
                {user.streak}
              </Text>
              <Text style={[
                styles.statLabel,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { fontSize: 13 * textMultiplier }
              ]}>
                Day Streak
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: cardBg }]}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={32}
                color={colors.highlight}
              />
              <Text style={[
                styles.statValue,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { color: textColor, fontSize: 28 * textMultiplier }
              ]}>
                {user.points}
              </Text>
              <Text style={[
                styles.statLabel,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                { fontSize: 13 * textMultiplier }
              ]}>
                Points
              </Text>
            </View>
          </View>
        </View>

        {user.badges && user.badges.length > 0 && (
          <View style={styles.badgesSection}>
            <Text style={[
              commonStyles.subtitle,
              styles.sectionTitle,
              settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
              { color: textColor, fontSize: 20 * textMultiplier }
            ]}>
              Recent Badges
            </Text>
            <View style={styles.badgesGrid}>
              {user.badges.slice(0, 4).map((badge, index) => (
                <View key={index} style={[styles.badgeCard, { backgroundColor: cardBg }]}>
                  <IconSymbol
                    ios_icon_name="rosette"
                    android_material_icon_name="emoji-events"
                    size={28}
                    color={colors.highlight}
                  />
                  <Text style={[
                    styles.badgeText,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { color: textColor, fontSize: 13 * textMultiplier }
                  ]}>
                    {badge}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[
            commonStyles.subtitle,
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 20 * textMultiplier }
          ]}>
            Quick Actions
          </Text>
          
          <SettingsItem
            icon="gear"
            materialIcon="settings"
            title="Settings"
            subtitle="Customize your experience"
            onPress={() => router.push('/(tabs)/settings')}
            textColor={textColor}
            cardBg={cardBg}
            textMultiplier={textMultiplier}
            dyslexiaFont={settings.accessibility.dyslexiaFont}
          />
          
          <SettingsItem
            icon="chart.bar"
            materialIcon="bar-chart"
            title="Analytics"
            subtitle="View your progress"
            onPress={() => router.push('/(tabs)/analytics')}
            textColor={textColor}
            cardBg={cardBg}
            textMultiplier={textMultiplier}
            dyslexiaFont={settings.accessibility.dyslexiaFont}
          />

          {user.isPremium && (
            <SettingsItem
              icon="arrow.clockwise"
              materialIcon="restore"
              title="Restore Purchases"
              subtitle="Restore your premium access"
              onPress={restorePurchases}
              textColor={textColor}
              cardBg={cardBg}
              textMultiplier={textMultiplier}
              dyslexiaFont={settings.accessibility.dyslexiaFont}
            />
          )}
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
    </View>
  );
}

const SettingsItem = ({
  icon,
  materialIcon,
  title,
  subtitle,
  onPress,
  textColor,
  cardBg,
  textMultiplier,
  dyslexiaFont,
}: {
  icon: string;
  materialIcon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  textColor: string;
  cardBg: string;
  textMultiplier: number;
  dyslexiaFont: boolean;
}) => (
  <TouchableOpacity style={[styles.settingsItem, { backgroundColor: cardBg }]} onPress={onPress}>
    <View style={styles.settingsIcon}>
      <IconSymbol
        ios_icon_name={icon}
        android_material_icon_name={materialIcon}
        size={24}
        color={colors.primary}
      />
    </View>
    <View style={styles.settingsContent}>
      <Text style={[
        styles.settingsTitle,
        dyslexiaFont && styles.dyslexiaFont,
        { color: textColor, fontSize: 15 * textMultiplier }
      ]}>
        {title}
      </Text>
      <Text style={[
        styles.settingsSubtitle,
        dyslexiaFont && styles.dyslexiaFont,
        { fontSize: 13 * textMultiplier }
      ]}>
        {subtitle}
      </Text>
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
  darkContainer: {
    backgroundColor: '#121212',
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
  avatarEmoji: {
    fontSize: 50,
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
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  premiumBadgeText: {
    fontSize: 14,
    fontWeight: '700',
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
  badgesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
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
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
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
  dyslexiaFont: {
    fontFamily: 'OpenDyslexic',
  },
});
