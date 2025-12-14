
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLesson } from '@/contexts/LessonContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

type TabType = 'notes' | 'flashcards' | 'questions' | 'quiz';

export default function LessonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getLessonById } = useLesson();
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const lesson = getLessonById(id as string);

  if (!lesson) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>Lesson not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentFlashcard = lesson.flashcards[currentFlashcardIndex];

  const handleNextFlashcard = () => {
    if (currentFlashcardIndex < lesson.flashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1);
      setIsFlipped(false);
    }
  };

  const renderNotes = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.notesContainer}>
        <Text style={styles.notesText}>{lesson.notes}</Text>
      </View>
    </ScrollView>
  );

  const renderFlashcards = () => (
    <View style={styles.tabContent}>
      <View style={styles.flashcardContainer}>
        <View style={styles.flashcardCounter}>
          <Text style={styles.flashcardCounterText}>
            {currentFlashcardIndex + 1} / {lesson.flashcards.length}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.flashcard}
          onPress={() => setIsFlipped(!isFlipped)}
          activeOpacity={0.9}
        >
          <View style={styles.flashcardContent}>
            <Text style={styles.flashcardLabel}>
              {isFlipped ? 'Answer' : 'Question'}
            </Text>
            <Text style={styles.flashcardText}>
              {isFlipped ? currentFlashcard.answer : currentFlashcard.question}
            </Text>
          </View>
          <View style={styles.flashcardHint}>
            <IconSymbol
              ios_icon_name="hand.tap"
              android_material_icon_name="touch-app"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.flashcardHintText}>Tap to flip</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.flashcardControls}>
          <TouchableOpacity
            style={[
              styles.flashcardButton,
              currentFlashcardIndex === 0 && styles.flashcardButtonDisabled,
            ]}
            onPress={handlePreviousFlashcard}
            disabled={currentFlashcardIndex === 0}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="chevron-left"
              size={24}
              color={currentFlashcardIndex === 0 ? colors.textSecondary : colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.flashcardButton,
              currentFlashcardIndex === lesson.flashcards.length - 1 &&
                styles.flashcardButtonDisabled,
            ]}
            onPress={handleNextFlashcard}
            disabled={currentFlashcardIndex === lesson.flashcards.length - 1}
          >
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={24}
              color={
                currentFlashcardIndex === lesson.flashcards.length - 1
                  ? colors.textSecondary
                  : colors.primary
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderQuestions = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.questionsContainer}>
        {lesson.examQuestions.map((question, index) => (
          <React.Fragment key={index}>
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Question {index + 1}</Text>
                <View style={styles.marksBadge}>
                  <Text style={styles.marksText}>{question.marks} marks</Text>
                </View>
              </View>
              <Text style={styles.questionText}>{question.question}</Text>
              
              {question.type === 'multiple-choice' && question.options && (
                <View style={styles.optionsContainer}>
                  {question.options.map((option, optionIndex) => (
                    <React.Fragment key={optionIndex}>
                      <View
                        style={[
                          styles.optionItem,
                          option === question.correctAnswer && styles.optionItemCorrect,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            option === question.correctAnswer && styles.optionTextCorrect,
                          ]}
                        >
                          {option}
                        </Text>
                        {option === question.correctAnswer && (
                          <IconSymbol
                            ios_icon_name="checkmark.circle.fill"
                            android_material_icon_name="check-circle"
                            size={20}
                            color={colors.success}
                          />
                        )}
                      </View>
                    </React.Fragment>
                  ))}
                </View>
              )}

              <View style={styles.explanationContainer}>
                <Text style={styles.explanationLabel}>Explanation:</Text>
                <Text style={styles.explanationText}>{question.explanation}</Text>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );

  const renderQuiz = () => (
    <View style={[styles.tabContent, commonStyles.centerContent]}>
      <IconSymbol
        ios_icon_name="checkmark.circle"
        android_material_icon_name="check-circle"
        size={64}
        color={colors.primary}
      />
      <Text style={[commonStyles.subtitle, styles.quizTitle]}>Quiz Mode</Text>
      <Text style={[commonStyles.textSecondary, styles.quizDescription]}>
        Test your knowledge with {lesson.quiz?.questions.length} questions
      </Text>
      <Text style={[commonStyles.textSecondary, styles.quizDescription]}>
        Time limit: {lesson.quiz?.timeLimit} minutes
      </Text>
      <TouchableOpacity
        style={styles.startQuizButton}
        onPress={() => Alert.alert('Coming Soon', 'Quiz feature will be available soon!')}
      >
        <Text style={styles.startQuizButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {lesson.title}
          </Text>
          <View style={styles.headerBadges}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{lesson.level}</Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{lesson.difficulty}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notes' && styles.tabActive]}
          onPress={() => setActiveTab('notes')}
        >
          <IconSymbol
            ios_icon_name="note.text"
            android_material_icon_name="description"
            size={20}
            color={activeTab === 'notes' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'notes' && styles.tabTextActive,
            ]}
          >
            Notes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'flashcards' && styles.tabActive]}
          onPress={() => setActiveTab('flashcards')}
        >
          <IconSymbol
            ios_icon_name="rectangle.stack"
            android_material_icon_name="style"
            size={20}
            color={activeTab === 'flashcards' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'flashcards' && styles.tabTextActive,
            ]}
          >
            Flashcards
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'questions' && styles.tabActive]}
          onPress={() => setActiveTab('questions')}
        >
          <IconSymbol
            ios_icon_name="questionmark.circle"
            android_material_icon_name="help"
            size={20}
            color={activeTab === 'questions' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'questions' && styles.tabTextActive,
            ]}
          >
            Questions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'quiz' && styles.tabActive]}
          onPress={() => setActiveTab('quiz')}
        >
          <IconSymbol
            ios_icon_name="checkmark.circle"
            android_material_icon_name="check-circle"
            size={20}
            color={activeTab === 'quiz' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'quiz' && styles.tabTextActive,
            ]}
          >
            Quiz
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'notes' && renderNotes()}
      {activeTab === 'flashcards' && renderFlashcards()}
      {activeTab === 'questions' && renderQuestions()}
      {activeTab === 'quiz' && renderQuiz()}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.secondary + '30',
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  notesContainer: {
    padding: 20,
  },
  notesText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
  },
  flashcardContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  flashcardCounter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  flashcardCounterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  flashcard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    minHeight: 300,
    justifyContent: 'center',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    marginBottom: 20,
  },
  flashcardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  flashcardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  flashcardText: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.text,
    fontWeight: '500',
  },
  flashcardHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  flashcardHintText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  flashcardControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  flashcardButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  flashcardButtonDisabled: {
    opacity: 0.3,
  },
  questionsContainer: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  marksBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.highlight + '30',
  },
  marksText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  questionText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 16,
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionItemCorrect: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  optionTextCorrect: {
    fontWeight: '600',
  },
  explanationContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  quizTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  quizDescription: {
    textAlign: 'center',
    marginBottom: 8,
  },
  startQuizButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  startQuizButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 16,
  },
});
