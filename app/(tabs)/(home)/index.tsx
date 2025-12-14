
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
import { Subject, Level, Difficulty } from '@/types/lesson';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { lessons } = useLesson();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [selectedLevel, setSelectedLevel] = useState<Level | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || lesson.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'All' || lesson.level === selectedLevel;
    const matchesDifficulty = selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSubject && matchesLevel && matchesDifficulty;
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
                ios_icon_name="flame"
                android_material_icon_name="local-fire-department"
                size={16}
                color={colors.accent}
              />
              <Text style={styles.statText}>{user?.streak} day streak</Text>
            </View>
          </View>
        </View>

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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          <FilterChip
            label="All Subjects"
            isSelected={selectedSubject === 'All'}
            onPress={() => setSelectedSubject('All')}
          />
          <FilterChip
            label="Mathematics"
            isSelected={selectedSubject === 'Mathematics'}
            onPress={() => setSelectedSubject('Mathematics')}
          />
          <FilterChip
            label="English"
            isSelected={selectedSubject === 'English'}
            onPress={() => setSelectedSubject('English')}
          />
          <FilterChip
            label="Science"
            isSelected={selectedSubject === 'Science'}
            onPress={() => setSelectedSubject('Science')}
          />
        </ScrollView>

        <View style={styles.levelDifficultyContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Level:</Text>
            <TouchableOpacity
              style={[styles.smallChip, selectedLevel === 'All' && styles.smallChipSelected]}
              onPress={() => setSelectedLevel('All')}
            >
              <Text style={[styles.smallChipText, selectedLevel === 'All' && styles.smallChipTextSelected]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallChip, selectedLevel === 'GCSE' && styles.smallChipSelected]}
              onPress={() => setSelectedLevel('GCSE')}
            >
              <Text style={[styles.smallChipText, selectedLevel === 'GCSE' && styles.smallChipTextSelected]}>
                GCSE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallChip, selectedLevel === 'A-Level' && styles.smallChipSelected]}
              onPress={() => setSelectedLevel('A-Level')}
            >
              <Text style={[styles.smallChipText, selectedLevel === 'A-Level' && styles.smallChipTextSelected]}>
                A-Level
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Difficulty:</Text>
            <TouchableOpacity
              style={[styles.smallChip, selectedDifficulty === 'All' && styles.smallChipSelected]}
              onPress={() => setSelectedDifficulty('All')}
            >
              <Text style={[styles.smallChipText, selectedDifficulty === 'All' && styles.smallChipTextSelected]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallChip, selectedDifficulty === 'Easy' && styles.smallChipSelected]}
              onPress={() => setSelectedDifficulty('Easy')}
            >
              <Text style={[styles.smallChipText, selectedDifficulty === 'Easy' && styles.smallChipTextSelected]}>
                Easy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallChip, selectedDifficulty === 'Medium' && styles.smallChipSelected]}
              onPress={() => setSelectedDifficulty('Medium')}
            >
              <Text style={[styles.smallChipText, selectedDifficulty === 'Medium' && styles.smallChipTextSelected]}>
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallChip, selectedDifficulty === 'Hard' && styles.smallChipSelected]}
              onPress={() => setSelectedDifficulty('Hard')}
            >
              <Text style={[styles.smallChipText, selectedDifficulty === 'Hard' && styles.smallChipTextSelected]}>
                Hard
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lessonsHeader}>
          <Text style={commonStyles.subtitle}>My Lessons</Text>
          <Text style={commonStyles.textSecondary}>
            {filteredLessons.length} {filteredLessons.length === 1 ? 'lesson' : 'lessons'}
          </Text>
        </View>

        {filteredLessons.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="book"
              android_material_icon_name="menu-book"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[commonStyles.text, styles.emptyText]}>
              No lessons found
            </Text>
            <Text style={commonStyles.textSecondary}>
              Create your first lesson to get started
            </Text>
          </View>
        ) : (
          <View style={styles.lessonsList}>
            {filteredLessons.map((lesson, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={commonStyles.card}
                  onPress={() => router.push(`/lesson/${lesson.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.lessonHeader}>
                    <View style={styles.lessonIcon}>
                      <IconSymbol
                        ios_icon_name="book.fill"
                        android_material_icon_name="menu-book"
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.lessonInfo}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <View style={styles.lessonMeta}>
                        <View style={[commonStyles.badge, styles.levelBadge]}>
                          <Text style={commonStyles.badgeText}>{lesson.level}</Text>
                        </View>
                        <View style={[commonStyles.badge, styles.difficultyBadge]}>
                          <Text style={commonStyles.badgeText}>{lesson.difficulty}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.progressContainer}>
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

                  <View style={styles.lessonStats}>
                    <View style={styles.statItem}>
                      <IconSymbol
                        ios_icon_name="note.text"
                        android_material_icon_name="description"
                        size={16}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.statItemText}>Notes</Text>
                    </View>
                    <View style={styles.statItem}>
                      <IconSymbol
                        ios_icon_name="rectangle.stack"
                        android_material_icon_name="style"
                        size={16}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.statItemText}>
                        {lesson.flashcards.length} cards
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <IconSymbol
                        ios_icon_name="questionmark.circle"
                        android_material_icon_name="help"
                        size={16}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.statItemText}>
                        {lesson.examQuestions.length} questions
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/lesson/create')}
        activeOpacity={0.8}
      >
        <IconSymbol
          ios_icon_name="plus"
          android_material_icon_name="add"
          size={28}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
}

const FilterChip = ({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.filterChip, isSelected && styles.filterChipSelected]}
    onPress={onPress}
  >
    <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
      {label}
    </Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterContainer: {
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
  levelDifficultyContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  smallChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  smallChipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  smallChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  smallChipTextSelected: {
    color: '#FFFFFF',
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
  },
  lessonsList: {
    paddingHorizontal: 20,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  levelBadge: {
    backgroundColor: colors.primary + '20',
  },
  difficultyBadge: {
    backgroundColor: colors.accent + '20',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  lessonStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statItemText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(116, 81, 235, 0.4)',
    elevation: 8,
  },
});
