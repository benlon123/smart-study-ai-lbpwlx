
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Subject, Level } from '@/types/lesson';

const subjects: Subject[] = [
  'Mathematics',
  'English Language',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
];

const levels: Level[] = ['GCSE', 'A-Level'];

export default function TasksScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [selectedLevel, setSelectedLevel] = useState<Level | 'All'>('All');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  if (!isAuthenticated) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <IconSymbol
          ios_icon_name="checklist"
          android_material_icon_name="task"
          size={80}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.subtitle, styles.notAuthTitle]}>
          Sign In Required
        </Text>
        <Text style={[commonStyles.textSecondary, styles.notAuthText]}>
          Sign in to track your tasks and progress
        </Text>
      </View>
    );
  }

  const mockTasks = [
    {
      id: '1',
      type: 'lesson',
      title: 'Complete Algebra Lesson',
      subject: 'Mathematics',
      level: 'GCSE',
      completed: false,
      priority: 'high',
      points: 50,
    },
    {
      id: '2',
      type: 'flashcards',
      title: 'Review Physics Flashcards',
      subject: 'Physics',
      level: 'A-Level',
      completed: true,
      priority: 'medium',
      points: 30,
    },
    {
      id: '3',
      type: 'quiz',
      title: 'Chemistry Quiz',
      subject: 'Chemistry',
      level: 'GCSE',
      completed: false,
      priority: 'high',
      points: 75,
    },
  ];

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Task Planner</Text>
            <Text style={commonStyles.textSecondary}>
              Track your study progress
            </Text>
          </View>
          <View style={styles.streakBadge}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local-fire-department"
              size={20}
              color={colors.accent}
            />
            <Text style={styles.streakText}>{user?.streak} days</Text>
          </View>
        </View>

        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'daily' && styles.viewModeButtonActive,
            ]}
            onPress={() => setViewMode('daily')}
          >
            <Text
              style={[
                styles.viewModeText,
                viewMode === 'daily' && styles.viewModeTextActive,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'weekly' && styles.viewModeButtonActive,
            ]}
            onPress={() => setViewMode('weekly')}
          >
            <Text
              style={[
                styles.viewModeText,
                viewMode === 'weekly' && styles.viewModeTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedSubject === 'All' && styles.filterChipSelected,
              ]}
              onPress={() => setSelectedSubject('All')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedSubject === 'All' && styles.filterChipTextSelected,
                ]}
              >
                All Subjects
              </Text>
            </TouchableOpacity>
            {subjects.map((subject, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedSubject === subject && styles.filterChipSelected,
                  ]}
                  onPress={() => setSelectedSubject(subject)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedSubject === subject && styles.filterChipTextSelected,
                    ]}
                  >
                    {subject}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        <View style={styles.levelFilters}>
          {levels.map((level, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={[
                  styles.levelChip,
                  selectedLevel === level && styles.levelChipSelected,
                ]}
                onPress={() => setSelectedLevel(level)}
              >
                <Text
                  style={[
                    styles.levelChipText,
                    selectedLevel === level && styles.levelChipTextSelected,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>

        <View style={styles.tasksSection}>
          <Text style={commonStyles.subtitle}>Today&apos;s Tasks</Text>
          <View style={styles.tasksList}>
            {mockTasks.map((task, index) => (
              <React.Fragment key={index}>
                <View style={styles.taskCard}>
                  <TouchableOpacity
                    style={[
                      styles.taskCheckbox,
                      task.completed && styles.taskCheckboxCompleted,
                    ]}
                    onPress={() => console.log('Toggle task:', task.id)}
                  >
                    {task.completed && (
                      <IconSymbol
                        ios_icon_name="checkmark"
                        android_material_icon_name="check"
                        size={16}
                        color="#FFFFFF"
                      />
                    )}
                  </TouchableOpacity>
                  
                  <View style={styles.taskContent}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleCompleted,
                      ]}
                    >
                      {task.title}
                    </Text>
                    <View style={styles.taskMeta}>
                      <View style={styles.taskBadge}>
                        <Text style={styles.taskBadgeText}>{task.subject}</Text>
                      </View>
                      <View style={styles.taskBadge}>
                        <Text style={styles.taskBadgeText}>{task.level}</Text>
                      </View>
                      <View style={styles.taskPoints}>
                        <IconSymbol
                          ios_icon_name="star.fill"
                          android_material_icon_name="star"
                          size={12}
                          color={colors.highlight}
                        />
                        <Text style={styles.taskPointsText}>{task.points}</Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.priorityIndicator,
                      task.priority === 'high' && styles.priorityHigh,
                      task.priority === 'medium' && styles.priorityMedium,
                    ]}
                  />
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.aiSuggestions}>
          <View style={styles.aiHeader}>
            <IconSymbol
              ios_icon_name="sparkles"
              android_material_icon_name="auto-awesome"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.aiTitle}>AI Suggestions</Text>
          </View>
          <Text style={styles.aiText}>
            Based on your performance, we recommend focusing on Chemistry and completing 2 more flashcard reviews today.
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  viewModeContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  viewModeButtonActive: {
    backgroundColor: colors.primary,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },
  filtersContainer: {
    marginBottom: 12,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  levelFilters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  levelChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelChipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  levelChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  levelChipTextSelected: {
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tasksSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tasksList: {
    marginTop: 16,
    gap: 12,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  taskBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  taskPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskPointsText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  priorityHigh: {
    backgroundColor: colors.error,
  },
  priorityMedium: {
    backgroundColor: colors.warning,
  },
  aiSuggestions: {
    marginHorizontal: 20,
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  aiText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  notAuthTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthText: {
    textAlign: 'center',
  },
});
