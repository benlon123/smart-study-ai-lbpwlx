
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLesson } from '@/contexts/LessonContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Subject, Level } from '@/types/lesson';
import { subjectTopics } from '@/utils/mockData';

const levels: Level[] = ['GCSE', 'A-Level'];

interface TaskItem {
  id: string;
  type: 'lesson' | 'flashcards' | 'notes' | 'quiz' | 'timed-challenge';
  title: string;
  subject: Subject;
  level: Level;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  points: number;
}

export default function TasksScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { lessons } = useLesson();
  const [selectedLevel, setSelectedLevel] = useState<Level>('GCSE');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [tasks, setTasks] = useState<TaskItem[]>([
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
      completed: false,
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
    {
      id: '4',
      type: 'notes',
      title: 'Review Biology Notes',
      subject: 'Biology',
      level: 'GCSE',
      completed: true,
      priority: 'medium',
      points: 40,
    },
    {
      id: '5',
      type: 'lesson',
      title: 'Complete English Literature Lesson',
      subject: 'English Literature',
      level: 'A-Level',
      completed: false,
      priority: 'high',
      points: 60,
    },
  ]);

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

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getSubjectsForLevel = (level: Level): Subject[] => {
    return subjectTopics.map(st => st.subject);
  };

  const filteredTasks = tasks.filter(task => {
    const levelMatch = task.level === selectedLevel;
    const subjectMatch = selectedSubject ? task.subject === selectedSubject : true;
    return levelMatch && subjectMatch;
  });

  const completedTasksCount = filteredTasks.filter(t => t.completed).length;
  const totalTasksCount = filteredTasks.length;
  const remainingTasksCount = totalTasksCount - completedTasksCount;

  const renderSubjectDropdown = () => (
    <Modal
      visible={showSubjectDropdown}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSubjectDropdown(false)}
    >
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={() => setShowSubjectDropdown(false)}
      >
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Select Subject</Text>
            <TouchableOpacity onPress={() => setShowSubjectDropdown(false)}>
              <IconSymbol
                ios_icon_name="xmark"
                android_material_icon_name="close"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                selectedSubject === null && styles.dropdownItemSelected,
              ]}
              onPress={() => {
                setSelectedSubject(null);
                setShowSubjectDropdown(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedSubject === null && styles.dropdownItemTextSelected,
                ]}
              >
                All Subjects
              </Text>
              {selectedSubject === null && (
                <IconSymbol
                  ios_icon_name="checkmark"
                  android_material_icon_name="check"
                  size={20}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>

            {getSubjectsForLevel(selectedLevel).map((subject, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedSubject === subject && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedSubject(subject);
                    setShowSubjectDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedSubject === subject && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {subject}
                  </Text>
                  {selectedSubject === subject && (
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

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
            <Text style={styles.streakText}>{user?.streak || 0} days</Text>
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

        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Level</Text>
          <View style={styles.levelFilters}>
            {levels.map((level, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.levelChip,
                    selectedLevel === level && styles.levelChipSelected,
                  ]}
                  onPress={() => {
                    setSelectedLevel(level);
                    setSelectedSubject(null);
                  }}
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
        </View>

        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Subject</Text>
          <TouchableOpacity
            style={styles.subjectDropdownButton}
            onPress={() => setShowSubjectDropdown(true)}
          >
            <Text style={styles.subjectDropdownButtonText}>
              {selectedSubject || 'All Subjects'}
            </Text>
            <IconSymbol
              ios_icon_name="chevron.down"
              android_material_icon_name="expand-more"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalTasksCount}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {completedTasksCount}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {remainingTasksCount}
            </Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>

        <View style={styles.tasksSection}>
          <Text style={commonStyles.subtitle}>
            {viewMode === 'daily' ? "Today's Tasks" : "This Week's Tasks"}
          </Text>
          
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="checkmark.circle"
                android_material_icon_name="check-circle"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyStateTitle}>No Tasks Found</Text>
              <Text style={styles.emptyStateText}>
                No tasks for {selectedSubject || 'any subject'} at {selectedLevel} level
              </Text>
            </View>
          ) : (
            <View style={styles.tasksList}>
              {filteredTasks.map((task, index) => (
                <React.Fragment key={index}>
                  <View style={styles.taskCard}>
                    <TouchableOpacity
                      style={[
                        styles.taskCheckbox,
                        task.completed && styles.taskCheckboxCompleted,
                      ]}
                      onPress={() => toggleTaskCompletion(task.id)}
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
                        task.priority === 'low' && styles.priorityLow,
                      ]}
                    />
                  </View>
                </React.Fragment>
              ))}
            </View>
          )}
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
            Based on your performance, we recommend focusing on {selectedSubject || 'Mathematics'} and completing 2 more tasks today to maintain your streak.
          </Text>
        </View>
      </ScrollView>

      {renderSubjectDropdown()}
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
    marginBottom: 20,
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
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  levelFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  levelChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
  },
  levelChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  levelChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  levelChipTextSelected: {
    color: '#FFFFFF',
  },
  subjectDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  subjectDropdownButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  dropdownScroll: {
    maxHeight: 400,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: colors.primary + '10',
  },
  dropdownItemText: {
    fontSize: 15,
    color: colors.text,
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: colors.primary,
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
  priorityLow: {
    backgroundColor: colors.success,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
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
