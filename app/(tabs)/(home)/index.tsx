
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLesson } from '@/contexts/LessonContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { lessons } = useLesson();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = 
      lesson.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <View style={[commonStyles.container, styles.authContainer]}>
        <View style={styles.authContent}>
          <IconSymbol
            ios_icon_name="graduationcap"
            android_material_icon_name="school"
            size={80}
            color={colors.primary}
          />
          <Text style={[commonStyles.title, styles.authTitle]}>SmartStudy AI</Text>
          <Text style={[commonStyles.textSecondary, styles.authSubtitle]}>
            AI-powered learning for GCSE & A-Level students
          </Text>
          
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={buttonStyles.primary}
              onPress={() => router.push('/auth/sign-up')}
            >
              <Text style={buttonStyles.textWhite}>Get Started</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={buttonStyles.outline}
              onPress={() => router.push('/auth/sign-in')}
            >
              <Text style={[buttonStyles.text, { color: colors.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
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
          <View>
            <Text style={styles.greeting}>Hello, {user?.name}! 👋</Text>
            <Text style={commonStyles.textSecondary}>Ready to learn today?</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBadge}>
              <IconSymbol
                ios_icon_name="flame.fill"
                android_material_icon_name="local-fire-department"
                size={16}
                color={colors.accent}
              />
              <Text style={styles.statText}>{user?.streak} day streak</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createLessonButton}
          onPress={() => router.push('/lesson/create')}
          activeOpacity={0.8}
        >
          <View style={styles.createLessonIcon}>
            <IconSymbol
              ios_icon_name="plus.circle.fill"
              android_material_icon_name="add-circle"
              size={32}
              color={colors.primary}
            />
          </View>
          <View style={styles.createLessonContent}>
            <Text style={styles.createLessonTitle}>Create New Lesson</Text>
            <Text style={styles.createLessonSubtitle}>
              AI-powered lessons with notes, flashcards & quizzes
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {lessons.length > 0 && (
          <>
            <View style={styles.searchContainer}>
              <IconSymbol
                ios_icon_name="magnifyingglass"
                android_material_icon_name="search"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search lessons..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.lessonsHeader}>
              <Text style={commonStyles.subtitle}>My Lessons</Text>
              <Text style={commonStyles.textSecondary}>
                {filteredLessons.length} {filteredLessons.length === 1 ? 'lesson' : 'lessons'}
              </Text>
            </View>
          </>
        )}

        {lessons.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="book.closed"
              android_material_icon_name="menu-book"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[commonStyles.text, styles.emptyText]}>
              No lessons yet
            </Text>
            <Text style={[commonStyles.textSecondary, styles.emptySubtext]}>
              Create your first lesson to get started with AI-powered learning
            </Text>
          </View>
        ) : filteredLessons.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[commonStyles.text, styles.emptyText]}>
              No lessons found
            </Text>
            <Text style={[commonStyles.textSecondary, styles.emptySubtext]}>
              Try a different search term
            </Text>
          </View>
        ) : (
          <View style={styles.lessonsList}>
            {filteredLessons.map((lesson, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.lessonBox}
                  onPress={() => router.push(`/lesson/${lesson.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.lessonBoxHeader}>
                    <View style={styles.lessonBoxIcon}>
                      <IconSymbol
                        ios_icon_name="book.fill"
                        android_material_icon_name="menu-book"
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.lessonBoxBadges}>
                      <View style={[commonStyles.badge, styles.levelBadge]}>
                        <Text style={styles.badgeText}>{lesson.level}</Text>
                      </View>
                      <View style={[commonStyles.badge, styles.difficultyBadge]}>
                        <Text style={styles.badgeText}>{lesson.difficulty}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={styles.lessonBoxSubject}>{lesson.subject}</Text>
                  <Text style={styles.lessonBoxTopic}>{lesson.topic}</Text>
                  <Text style={styles.lessonBoxDescription} numberOfLines={2}>
                    {lesson.description}
                  </Text>

                  <View style={styles.lessonBoxFooter}>
                    <View style={styles.lessonBoxStats}>
                      <View style={styles.lessonBoxStat}>
                        <IconSymbol
                          ios_icon_name="note.text"
                          android_material_icon_name="description"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.lessonBoxStatText}>Notes</Text>
                      </View>
                      <View style={styles.lessonBoxStat}>
                        <IconSymbol
                          ios_icon_name="rectangle.stack"
                          android_material_icon_name="style"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.lessonBoxStatText}>
                          {lesson.flashcards.length}
                        </Text>
                      </View>
                      <View style={styles.lessonBoxStat}>
                        <IconSymbol
                          ios_icon_name="questionmark.circle"
                          android_material_icon_name="help"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.lessonBoxStatText}>
                          {lesson.examQuestions.length}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.progressIndicator}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${lesson.progress}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{lesson.progress}%</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
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
  authContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  authContent: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  authTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  authSubtitle: {
    textAlign: 'center',
    marginBottom: 40,
  },
  authButtons: {
    width: '100%',
    gap: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statsContainer: {
    marginTop: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  createLessonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(116, 81, 235, 0.15)',
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  createLessonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createLessonContent: {
    flex: 1,
  },
  createLessonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  createLessonSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  lessonsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptySubtext: {
    textAlign: 'center',
  },
  lessonsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  lessonBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  lessonBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonBoxIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonBoxBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  levelBadge: {
    backgroundColor: colors.primary + '20',
  },
  difficultyBadge: {
    backgroundColor: colors.accent + '20',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  lessonBoxSubject: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  lessonBoxTopic: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  lessonBoxDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  lessonBoxFooter: {
    gap: 12,
  },
  lessonBoxStats: {
    flexDirection: 'row',
    gap: 16,
  },
  lessonBoxStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonBoxStatText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    minWidth: 35,
  },
});
