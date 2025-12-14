
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function InfoScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const features = [
    {
      icon: 'book.fill',
      androidIcon: 'menu-book',
      title: 'AI-Powered Lessons',
      description: 'Create comprehensive lessons with AI-generated content tailored to your subject, level, and difficulty.',
      free: true,
      premium: true,
      limit: 'Free: 5 lessons max | Premium: Unlimited',
    },
    {
      icon: 'rectangle.stack.fill',
      androidIcon: 'style',
      title: 'Smart Flashcards',
      description: 'Generate flashcards with spaced repetition to help you memorize key concepts and terms effectively.',
      free: false,
      premium: true,
      limit: 'Premium Only',
    },
    {
      icon: 'note.text',
      androidIcon: 'description',
      title: 'Detailed Notes',
      description: 'AI-generated notes with key concepts, examples, and terminology for comprehensive understanding.',
      free: true,
      premium: true,
      limit: 'Available to all users',
    },
    {
      icon: 'questionmark.circle.fill',
      androidIcon: 'help',
      title: 'Exam Questions & Quizzes',
      description: 'Practice with AI-generated exam-style questions, including multiple choice, multi-select, and essay questions.',
      free: true,
      premium: true,
      limit: 'Available to all users',
    },
    {
      icon: 'checklist',
      androidIcon: 'checklist',
      title: 'Task Planner',
      description: 'Adaptive AI task planner that generates personalized study tasks based on your performance and subjects.',
      free: true,
      premium: true,
      limit: 'Available to all users',
    },
    {
      icon: 'chart.bar.fill',
      androidIcon: 'bar-chart',
      title: 'Analytics & Progress',
      description: 'Track your progress across subjects, view performance graphs, and get AI suggestions for improvement.',
      free: true,
      premium: true,
      limit: 'Free: Basic | Premium: Advanced + Export',
    },
    {
      icon: 'flame.fill',
      androidIcon: 'local-fire-department',
      title: 'Streaks & Gamification',
      description: 'Build study streaks, earn points, unlock badges, and compete on leaderboards to stay motivated.',
      free: true,
      premium: true,
      limit: 'Available to all users',
    },
    {
      icon: 'book.closed.fill',
      androidIcon: 'auto-stories',
      title: 'Literature Book Support',
      description: 'Study specific books with quote selection and analysis for English Literature and other subjects.',
      free: true,
      premium: true,
      limit: 'Available to all users',
    },
    {
      icon: 'arrow.down.circle.fill',
      androidIcon: 'download',
      title: 'Export & Print',
      description: 'Export your lessons, notes, and analytics to PDF for offline study or printing.',
      free: false,
      premium: true,
      limit: 'Premium Only',
    },
    {
      icon: 'wifi.slash',
      androidIcon: 'cloud-off',
      title: 'Offline Mode',
      description: 'Access your lessons and study materials without an internet connection.',
      free: false,
      premium: true,
      limit: 'Premium Only',
    },
    {
      icon: 'sparkles',
      androidIcon: 'auto-awesome',
      title: 'Advanced AI Explanations',
      description: 'Get detailed AI explanations for incorrect answers with step-by-step breakdowns.',
      free: false,
      premium: true,
      limit: 'Premium Only',
    },
    {
      icon: 'timer',
      androidIcon: 'timer',
      title: 'Exam Simulator',
      description: 'Practice with timed exams that simulate real test conditions with detailed feedback.',
      free: false,
      premium: true,
      limit: 'Premium Only',
    },
  ];

  const premiumBenefits = [
    'Unlimited lesson creation (Free users limited to 5 lessons)',
    'Access to smart flashcards with spaced repetition',
    'Export lessons, notes, and analytics to PDF',
    'Offline mode for studying without internet',
    'Advanced AI explanations for all questions',
    'Exam simulator with timed practice tests',
    'Priority AI content generation',
    'Remove all limitations and unlock full potential',
  ];

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>App Info</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Overview */}
        <View style={styles.section}>
          <View style={styles.appIconContainer}>
            <IconSymbol
              ios_icon_name="graduationcap.fill"
              android_material_icon_name="school"
              size={64}
              color={colors.primary}
            />
          </View>
          <Text style={styles.appTitle}>SmartStudy AI</Text>
          <Text style={styles.appSubtitle}>
            AI-powered learning platform for GCSE & A-Level students
          </Text>
          <Text style={styles.appDescription}>
            SmartStudy AI helps you create personalized lessons, generate flashcards, 
            take quizzes, and track your progress across all your subjects. Our AI 
            adapts to your learning style and helps you achieve your academic goals.
          </Text>
        </View>

        {/* Current Plan Status */}
        {user && (
          <View style={[styles.section, styles.planSection]}>
            <View style={styles.planHeader}>
              <IconSymbol
                ios_icon_name={user.isPremium ? 'crown.fill' : 'person.fill'}
                android_material_icon_name={user.isPremium ? 'workspace-premium' : 'person'}
                size={32}
                color={user.isPremium ? '#FFD700' : colors.primary}
              />
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>
                  {user.isPremium ? 'Premium Member' : 'Free Plan'}
                </Text>
                <Text style={styles.planSubtitle}>
                  {user.isPremium 
                    ? 'You have access to all features' 
                    : 'Limited to 5 lessons'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Features List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.sectionDescription}>
            Explore all the powerful features available in SmartStudy AI
          </Text>
          
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <React.Fragment key={index}>
                <View style={styles.featureCard}>
                  <View style={styles.featureHeader}>
                    <View style={styles.featureIconContainer}>
                      <IconSymbol
                        ios_icon_name={feature.icon}
                        android_material_icon_name={feature.androidIcon}
                        size={24}
                        color={feature.premium && !feature.free ? '#FFD700' : colors.primary}
                      />
                    </View>
                    <View style={styles.featureBadgeContainer}>
                      {feature.free && (
                        <View style={[styles.featureBadge, styles.freeBadge]}>
                          <Text style={styles.freeBadgeText}>FREE</Text>
                        </View>
                      )}
                      {feature.premium && !feature.free && (
                        <View style={[styles.featureBadge, styles.premiumBadge]}>
                          <IconSymbol
                            ios_icon_name="crown.fill"
                            android_material_icon_name="workspace-premium"
                            size={12}
                            color="#FFFFFF"
                          />
                          <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  
                  <View style={styles.featureLimitContainer}>
                    <IconSymbol
                      ios_icon_name="info.circle"
                      android_material_icon_name="info"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.featureLimitText}>{feature.limit}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Premium Benefits */}
        <View style={styles.section}>
          <View style={styles.premiumHeader}>
            <IconSymbol
              ios_icon_name="crown.fill"
              android_material_icon_name="workspace-premium"
              size={32}
              color="#FFD700"
            />
            <Text style={styles.sectionTitle}>Premium Benefits</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Unlock the full potential of SmartStudy AI with Premium
          </Text>
          
          <View style={styles.benefitsList}>
            {premiumBenefits.map((benefit, index) => (
              <React.Fragment key={index}>
                <View style={styles.benefitItem}>
                  <View style={styles.benefitCheckmark}>
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {!user?.isPremium && (
            <View style={styles.upgradePrompt}>
              <Text style={styles.upgradePromptTitle}>Ready to upgrade?</Text>
              <Text style={styles.upgradePromptText}>
                Contact the admin or purchase Premium through the app to unlock all features
              </Text>
            </View>
          )}
        </View>

        {/* Subjects Supported */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subjects Supported</Text>
          <Text style={styles.sectionDescription}>
            We support all major GCSE and A-Level subjects
          </Text>
          
          <View style={styles.subjectsList}>
            <View style={styles.subjectCategory}>
              <Text style={styles.subjectCategoryTitle}>Core Subjects</Text>
              <Text style={styles.subjectCategoryText}>
                Mathematics, English Language, English Literature, Science, Physics, 
                Chemistry, Biology
              </Text>
            </View>
            
            <View style={styles.subjectCategory}>
              <Text style={styles.subjectCategoryTitle}>Humanities</Text>
              <Text style={styles.subjectCategoryText}>
                History, Geography, Religious Studies, Sociology, Psychology
              </Text>
            </View>
            
            <View style={styles.subjectCategory}>
              <Text style={styles.subjectCategoryTitle}>Languages</Text>
              <Text style={styles.subjectCategoryText}>
                French, Spanish, German
              </Text>
            </View>
            
            <View style={styles.subjectCategory}>
              <Text style={styles.subjectCategoryTitle}>Creative & Technical</Text>
              <Text style={styles.subjectCategoryText}>
                Art & Design, Music, Drama, Computer Science, Design & Technology, 
                Media Studies
              </Text>
            </View>
            
            <View style={styles.subjectCategory}>
              <Text style={styles.subjectCategoryTitle}>BTEC Courses</Text>
              <Text style={styles.subjectCategoryText}>
                Business, Sport, Health & Social Care, IT, Engineering, Applied Science
              </Text>
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Create a Lesson</Text>
                <Text style={styles.stepDescription}>
                  Choose your subject, level (GCSE/A-Level), difficulty, and topic. 
                  For literature, select specific books and quotes.
                </Text>
              </View>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Generate Content</Text>
                <Text style={styles.stepDescription}>
                  Inside your lesson, generate AI-powered notes, flashcards, and quizzes 
                  tailored to your selected topic.
                </Text>
              </View>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Study & Practice</Text>
                <Text style={styles.stepDescription}>
                  Review your notes, practice with flashcards, and test yourself with 
                  exam-style questions and quizzes.
                </Text>
              </View>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Track Progress</Text>
                <Text style={styles.stepDescription}>
                  Monitor your performance with analytics, build study streaks, and 
                  earn badges as you progress.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Support */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Text style={styles.sectionDescription}>
            If you have any questions or need assistance, please reach out to our support team.
          </Text>
          
          <View style={styles.supportCard}>
            <IconSymbol
              ios_icon_name="envelope.fill"
              android_material_icon_name="email"
              size={24}
              color={colors.primary}
            />
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Contact Support</Text>
              <Text style={styles.supportText}>support@smartstudyai.com</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  lastSection: {
    paddingBottom: 32,
  },
  appIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  planSection: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  featuresList: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBadgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  freeBadge: {
    backgroundColor: colors.success,
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  featureLimitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  featureLimitText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  benefitsList: {
    gap: 12,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  upgradePrompt: {
    backgroundColor: colors.primary + '15',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  upgradePromptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  upgradePromptText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  subjectsList: {
    gap: 16,
  },
  subjectCategory: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectCategoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subjectCategoryText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  stepsList: {
    gap: 20,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  supportText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
