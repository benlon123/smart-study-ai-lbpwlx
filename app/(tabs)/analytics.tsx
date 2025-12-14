
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLesson } from '@/contexts/LessonContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Subject, Difficulty } from '@/types/lesson';

const { width: screenWidth } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { user, isAuthenticated } = useAuth();
  const { lessons } = useLesson();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  if (!isAuthenticated) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <IconSymbol
          ios_icon_name="chart.bar"
          android_material_icon_name="bar-chart"
          size={80}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.subtitle, styles.notAuthTitle]}>
          Sign In Required
        </Text>
        <Text style={[commonStyles.textSecondary, styles.notAuthText]}>
          Sign in to view your analytics and progress
        </Text>
      </View>
    );
  }

  const totalFlashcards = lessons.reduce((sum, lesson) => sum + lesson.flashcards.length, 0);
  const totalQuestions = lessons.reduce((sum, lesson) => sum + lesson.examQuestions.length, 0);
  const avgProgress = lessons.length > 0
    ? Math.round(lessons.reduce((sum, lesson) => sum + lesson.progress, 0) / lessons.length)
    : 0;

  // Calculate subject-specific data
  const subjectData = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.subject]) {
      acc[lesson.subject] = {
        lessonCount: 0,
        flashcardCount: 0,
        avgProgress: 0,
        totalProgress: 0,
      };
    }
    acc[lesson.subject].lessonCount++;
    acc[lesson.subject].flashcardCount += lesson.flashcards.length;
    acc[lesson.subject].totalProgress += lesson.progress;
    acc[lesson.subject].avgProgress = Math.round(
      acc[lesson.subject].totalProgress / acc[lesson.subject].lessonCount
    );
    return acc;
  }, {} as Record<string, { lessonCount: number; flashcardCount: number; avgProgress: number; totalProgress: number }>);

  const topSubjects = Object.entries(subjectData)
    .sort((a, b) => b[1].lessonCount - a[1].lessonCount)
    .slice(0, 5);

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={commonStyles.textSecondary}>
            Track your learning progress
          </Text>
        </View>

        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'week' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === 'week' && styles.periodTextActive,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === 'month' && styles.periodTextActive,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'year' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === 'year' && styles.periodTextActive,
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Overall Progress</Text>
          <View style={styles.progressCircle}>
            <Text style={styles.progressValue}>{avgProgress}%</Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>{lessons.length}</Text>
              <Text style={styles.overviewStatLabel}>Lessons</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>{totalFlashcards}</Text>
              <Text style={styles.overviewStatLabel}>Flashcards</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>{totalQuestions}</Text>
              <Text style={styles.overviewStatLabel}>Questions</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Progress by Subject</Text>
          <View style={styles.subjectsList}>
            {topSubjects.length > 0 ? (
              topSubjects.map(([subject, data], index) => (
                <React.Fragment key={index}>
                  <View style={styles.subjectCard}>
                    <View style={styles.subjectHeader}>
                      <Text style={styles.subjectName}>{subject}</Text>
                      <Text style={styles.subjectProgress}>
                        {data.avgProgress}%
                      </Text>
                    </View>
                    <View style={styles.subjectProgressBar}>
                      <View
                        style={[
                          styles.subjectProgressFill,
                          { width: `${data.avgProgress}%` },
                        ]}
                      />
                    </View>
                    <View style={styles.subjectStats}>
                      <Text style={styles.subjectStatText}>
                        {data.lessonCount} {data.lessonCount === 1 ? 'lesson' : 'lessons'}
                      </Text>
                      <Text style={styles.subjectStatText}>
                        {data.flashcardCount} flashcards
                      </Text>
                    </View>
                  </View>
                </React.Fragment>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No subject data available yet. Create lessons to see your progress!
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Performance by Difficulty</Text>
          <View style={styles.difficultyGrid}>
            {['Easy', 'Normal', 'Hard'].map((difficulty, index) => {
              const difficultyLessons = lessons.filter(l => l.difficulty === difficulty);
              const avgScore = difficultyLessons.length > 0
                ? Math.round(
                    difficultyLessons.reduce((sum, l) => sum + l.progress, 0) / difficultyLessons.length
                  )
                : 0;

              return (
                <React.Fragment key={index}>
                  <View style={styles.difficultyCard}>
                    <View style={styles.difficultyHeader}>
                      <IconSymbol
                        ios_icon_name="chart.line.uptrend.xyaxis"
                        android_material_icon_name="trending-up"
                        size={24}
                        color={
                          difficulty === 'Easy'
                            ? colors.success
                            : difficulty === 'Normal'
                            ? colors.warning
                            : colors.error
                        }
                      />
                    </View>
                    <Text style={styles.difficultyName}>{difficulty}</Text>
                    <Text style={styles.difficultyScore}>
                      {avgScore}%
                    </Text>
                    <Text style={styles.difficultyLabel}>Avg. Progress</Text>
                    <Text style={styles.difficultyCount}>
                      {difficultyLessons.length} {difficultyLessons.length === 1 ? 'lesson' : 'lessons'}
                    </Text>
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.aiInsightsHeader}>
            <IconSymbol
              ios_icon_name="sparkles"
              android_material_icon_name="auto-awesome"
              size={20}
              color={colors.primary}
            />
            <Text style={commonStyles.subtitle}>AI Insights</Text>
          </View>
          
          {lessons.length > 0 ? (
            <>
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>🎯 Focus Areas</Text>
                <Text style={styles.insightText}>
                  {topSubjects.length > 0
                    ? `You're performing well in ${topSubjects[0][0]}! ${
                        topSubjects.length > 1 && topSubjects[1][1].avgProgress < 70
                          ? `Consider spending more time on ${topSubjects[1][0]} to improve your overall score.`
                          : 'Keep up the great work across all subjects!'
                      }`
                    : 'Start creating lessons to get personalized insights!'}
                </Text>
              </View>
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>📈 Progress Trend</Text>
                <Text style={styles.insightText}>
                  Your study consistency is excellent with a {user?.streak || 0}-day streak! 
                  {avgProgress >= 70
                    ? ' You\'re making great progress across your lessons.'
                    : ' Focus on completing more lessons to boost your overall progress.'}
                </Text>
              </View>
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>💡 Recommendation</Text>
                <Text style={styles.insightText}>
                  {totalFlashcards > 0
                    ? 'Try reviewing flashcards in the morning for better retention. Studies show morning review improves recall by 30%.'
                    : 'Generate flashcards for your lessons to improve retention and test your knowledge!'}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Create your first lesson to start receiving personalized AI insights!
              </Text>
            </View>
          )}
        </View>

        {!user?.isPremium && (
          <View style={styles.premiumBanner}>
            <IconSymbol
              ios_icon_name="crown.fill"
              android_material_icon_name="workspace-premium"
              size={32}
              color={colors.highlight}
            />
            <Text style={styles.premiumTitle}>Unlock Premium Analytics</Text>
            <Text style={styles.premiumText}>
              Get detailed insights, export reports, and advanced performance tracking
            </Text>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        )}
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
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  overviewCard: {
    marginHorizontal: 20,
    marginBottom: 28,
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  progressCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 8,
    borderColor: colors.primary,
  },
  progressValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
  },
  progressLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  overviewStats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  overviewStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  subjectsList: {
    marginTop: 16,
    gap: 12,
  },
  subjectCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  subjectProgress: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  subjectProgressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  subjectProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  subjectStats: {
    flexDirection: 'row',
    gap: 16,
  },
  subjectStatText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  difficultyGrid: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  difficultyCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  difficultyHeader: {
    marginBottom: 12,
  },
  difficultyName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  difficultyScore: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  difficultyLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  difficultyCount: {
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  aiInsightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  premiumBanner: {
    marginHorizontal: 20,
    backgroundColor: colors.primary + '10',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  premiumText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  premiumButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notAuthTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthText: {
    textAlign: 'center',
  },
});
