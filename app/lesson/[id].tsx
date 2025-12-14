
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLesson } from '@/contexts/LessonContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { ExamQuestion } from '@/types/lesson';

type TabType = 'notes' | 'flashcards' | 'quiz';

interface QuizAnswer {
  questionId: string;
  selectedAnswer: string | string[];
  isCorrect: boolean;
}

export default function LessonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getLessonById, generateNotes, generateFlashcards, generateQuiz } = useLesson();
  const { settings } = useSettings();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState<'notes' | 'flashcards' | 'quiz' | null>(null);
  
  // Notes subtopic state
  const [notesSubtopic, setNotesSubtopic] = useState('');
  const [showSubtopicInput, setShowSubtopicInput] = useState(false);
  
  // Flashcard count selection
  const [flashcardCount, setFlashcardCount] = useState<10 | 20 | 30>(10);
  const [showFlashcardOptions, setShowFlashcardOptions] = useState(false);
  
  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const lesson = getLessonById(id as string);

  if (!lesson) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={[commonStyles.text, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
          Lesson not found
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentFlashcard = lesson.flashcards[currentFlashcardIndex];
  const currentQuestion = lesson.quiz?.questions[currentQuestionIndex];

  const handleGenerateNotes = async () => {
    if (showSubtopicInput && !notesSubtopic.trim()) {
      Alert.alert('Subtopic Required', 'Please enter a specific subtopic for your notes.');
      return;
    }

    setIsGenerating(true);
    setGeneratingType('notes');
    try {
      await generateNotes(lesson.id, notesSubtopic.trim() || undefined);
      Alert.alert(
        'Notes Generated! 📝',
        `Your lesson notes (400-500 words) ${notesSubtopic ? `on "${notesSubtopic}"` : ''} have been created successfully.`,
        [{ text: 'OK' }]
      );
      setShowSubtopicInput(false);
      setNotesSubtopic('');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to generate notes');
    } finally {
      setIsGenerating(false);
      setGeneratingType(null);
    }
  };

  const handleGenerateFlashcards = async () => {
    // Check premium status
    if (!user?.isPremium) {
      Alert.alert(
        'Premium Feature 🌟',
        'Flashcards are a premium feature. Upgrade to premium to generate flashcards with spaced repetition.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Learn More', onPress: () => console.log('Navigate to premium') }
        ]
      );
      return;
    }

    setIsGenerating(true);
    setGeneratingType('flashcards');
    try {
      await generateFlashcards(lesson.id, flashcardCount);
      Alert.alert(
        'Flashcards Generated! 🎴',
        `${flashcardCount} flashcards have been created successfully.`,
        [{ text: 'OK' }]
      );
      setActiveTab('flashcards');
      setShowFlashcardOptions(false);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to generate flashcards');
    } finally {
      setIsGenerating(false);
      setGeneratingType(null);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setGeneratingType('quiz');
    try {
      await generateQuiz(lesson.id);
      Alert.alert(
        'Quiz Generated! 📋',
        'Your quiz and exam questions have been created successfully.',
        [{ text: 'OK' }]
      );
      setActiveTab('quiz');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to generate quiz');
    } finally {
      setIsGenerating(false);
      setGeneratingType(null);
    }
  };

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

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setSelectedAnswer('');
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleSelectAnswer = (answer: string) => {
    if (currentQuestion?.type === 'multi-select') {
      // Toggle answer in multi-select
      if (selectedAnswers.includes(answer)) {
        setSelectedAnswers(selectedAnswers.filter(a => a !== answer));
      } else {
        setSelectedAnswers([...selectedAnswers, answer]);
      }
    } else {
      // Single select
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;
    
    const isMultiSelect = currentQuestion.type === 'multi-select';
    const userAnswer = isMultiSelect ? selectedAnswers : selectedAnswer;
    
    if ((isMultiSelect && selectedAnswers.length === 0) || (!isMultiSelect && !selectedAnswer)) {
      Alert.alert('No Answer Selected', 'Please select at least one answer before continuing.');
      return;
    }

    let isCorrect = false;
    
    if (isMultiSelect && Array.isArray(currentQuestion.correctAnswer)) {
      // Check if arrays match (order doesn't matter)
      const sortedUserAnswers = [...selectedAnswers].sort();
      const sortedCorrectAnswers = [...currentQuestion.correctAnswer].sort();
      isCorrect = JSON.stringify(sortedUserAnswers) === JSON.stringify(sortedCorrectAnswers);
    } else if (!isMultiSelect) {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: userAnswer,
      isCorrect,
    };

    const updatedAnswers = [...quizAnswers, newAnswer];
    setQuizAnswers(updatedAnswers);

    if (currentQuestionIndex < (lesson.quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setSelectedAnswers([]);
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setSelectedAnswer('');
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const calculateScore = () => {
    const correctAnswers = quizAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = lesson.quiz?.questions.length || 0;
    return {
      correct: correctAnswers,
      total: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100),
    };
  };

  const renderNotes = () => {
    if (!lesson.notes) {
      return (
        <View style={[styles.tabContent, styles.emptyStateContainer]}>
          <IconSymbol
            ios_icon_name="note.text"
            android_material_icon_name="description"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyStateTitle, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
            No Notes Yet
          </Text>
          <Text style={[styles.emptyStateDescription, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
            Generate comprehensive notes (400-500 words) covering key concepts for this lesson
            {lesson.selectedQuotes && lesson.selectedQuotes.length > 0 && ` including analysis of ${lesson.selectedQuotes.length} selected quotes`}
          </Text>

          {!showSubtopicInput ? (
            <View style={styles.notesButtonContainer}>
              <TouchableOpacity
                style={[buttonStyles.primary, styles.generateContentButton]}
                onPress={() => setShowSubtopicInput(true)}
              >
                <IconSymbol
                  ios_icon_name="text.badge.plus"
                  android_material_icon_name="edit-note"
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={buttonStyles.textWhite}>Specify Subtopic</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[buttonStyles.outline, styles.generateContentButton]}
                onPress={handleGenerateNotes}
                disabled={isGenerating}
              >
                {isGenerating && generatingType === 'notes' ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <IconSymbol
                      ios_icon_name="sparkles"
                      android_material_icon_name="auto-awesome"
                      size={18}
                      color={colors.primary}
                    />
                    <Text style={[buttonStyles.text, { color: colors.primary }]}>
                      Generate General Notes
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.subtopicInputContainer}>
              <Text style={[styles.subtopicLabel, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                Enter a specific subtopic within {lesson.topic}:
              </Text>
              <Text style={[styles.subtopicExample, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                Example: "ATP system", "muscular responses to exercise", "photosynthesis process"
              </Text>
              <TextInput
                style={[
                  commonStyles.input,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  settings.accessibility.highContrast && styles.highContrastInput
                ]}
                placeholder="e.g., ATP system"
                placeholderTextColor={colors.textSecondary}
                value={notesSubtopic}
                onChangeText={setNotesSubtopic}
                autoFocus
              />
              <View style={styles.subtopicButtons}>
                <TouchableOpacity
                  style={[buttonStyles.outline, { flex: 1 }]}
                  onPress={() => {
                    setShowSubtopicInput(false);
                    setNotesSubtopic('');
                  }}
                >
                  <Text style={[buttonStyles.text, { color: colors.primary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[buttonStyles.primary, { flex: 1 }]}
                  onPress={handleGenerateNotes}
                  disabled={isGenerating}
                >
                  {isGenerating && generatingType === 'notes' ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={buttonStyles.textWhite}>Generate</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    }

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <View style={styles.notesContainer}>
          <Text style={[
            styles.notesText,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            settings.accessibility.highContrast && styles.highContrastText
          ]}>
            {lesson.notes}
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderFlashcards = () => {
    if (lesson.flashcards.length === 0) {
      return (
        <View style={[styles.tabContent, styles.emptyStateContainer]}>
          <IconSymbol
            ios_icon_name="rectangle.stack"
            android_material_icon_name="style"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyStateTitle, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
            No Flashcards Yet
          </Text>
          <Text style={[styles.emptyStateDescription, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
            Generate flashcards to start practicing with spaced repetition
            {lesson.selectedQuotes && lesson.selectedQuotes.length > 0 && ` including quote analysis`}
          </Text>

          {!user?.isPremium && (
            <View style={styles.premiumBanner}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={24}
                color={colors.highlight}
              />
              <Text style={styles.premiumBannerText}>
                Flashcards are a Premium Feature
              </Text>
            </View>
          )}

          {!showFlashcardOptions ? (
            <TouchableOpacity
              style={[buttonStyles.primary, styles.generateContentButton]}
              onPress={() => setShowFlashcardOptions(true)}
            >
              <IconSymbol
                ios_icon_name="sparkles"
                android_material_icon_name="auto-awesome"
                size={18}
                color="#FFFFFF"
              />
              <Text style={buttonStyles.textWhite}>Generate Flashcards</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.flashcardOptionsContainer}>
              <Text style={[styles.flashcardOptionsTitle, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                How many flashcards would you like?
              </Text>
              
              <TouchableOpacity
                style={[
                  styles.flashcardOptionButton,
                  flashcardCount === 10 && styles.flashcardOptionButtonSelected
                ]}
                onPress={() => setFlashcardCount(10)}
              >
                <Text style={[
                  styles.flashcardOptionText,
                  flashcardCount === 10 && styles.flashcardOptionTextSelected,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  10 Flashcards
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.flashcardOptionButton,
                  flashcardCount === 20 && styles.flashcardOptionButtonSelected
                ]}
                onPress={() => setFlashcardCount(20)}
              >
                <Text style={[
                  styles.flashcardOptionText,
                  flashcardCount === 20 && styles.flashcardOptionTextSelected,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  20 Flashcards
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.flashcardOptionButton,
                  flashcardCount === 30 && styles.flashcardOptionButtonSelected
                ]}
                onPress={() => setFlashcardCount(30)}
              >
                <Text style={[
                  styles.flashcardOptionText,
                  flashcardCount === 30 && styles.flashcardOptionTextSelected,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  30 Flashcards
                </Text>
              </TouchableOpacity>

              <View style={styles.flashcardOptionsButtons}>
                <TouchableOpacity
                  style={[buttonStyles.outline, { flex: 1 }]}
                  onPress={() => setShowFlashcardOptions(false)}
                >
                  <Text style={[buttonStyles.text, { color: colors.primary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[buttonStyles.primary, { flex: 1 }]}
                  onPress={handleGenerateFlashcards}
                  disabled={isGenerating}
                >
                  {isGenerating && generatingType === 'flashcards' ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={buttonStyles.textWhite}>Generate</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.flashcardContainer}>
          <View style={styles.flashcardCounter}>
            <Text style={[styles.flashcardCounterText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
              {currentFlashcardIndex + 1} / {lesson.flashcards.length}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.flashcard,
              settings.accessibility.highContrast && styles.highContrastCard
            ]}
            onPress={() => setIsFlipped(!isFlipped)}
            activeOpacity={0.9}
          >
            <View style={styles.flashcardContent}>
              <Text style={[
                styles.flashcardLabel,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont
              ]}>
                {isFlipped ? 'Answer' : 'Question'}
              </Text>
              <Text style={[
                styles.flashcardText,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                settings.accessibility.highContrast && styles.highContrastText
              ]}>
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
              <Text style={[styles.flashcardHintText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                Tap to flip
              </Text>
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
  };

  const renderQuizResults = () => {
    const score = calculateScore();
    const didWell = score.percentage >= 70;

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsContainer}>
          <View style={[styles.resultsHeader, didWell ? styles.resultsHeaderSuccess : styles.resultsHeaderWarning]}>
            <IconSymbol
              ios_icon_name={didWell ? "checkmark.circle.fill" : "exclamationmark.triangle.fill"}
              android_material_icon_name={didWell ? "check-circle" : "warning"}
              size={64}
              color={didWell ? colors.success : colors.warning}
            />
            <Text style={[styles.resultsTitle, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
              {didWell ? 'Great Job! 🎉' : 'Keep Practicing! 💪'}
            </Text>
            <Text style={[styles.resultsScore, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
              {score.correct} / {score.total} ({score.percentage}%)
            </Text>
            <Text style={[styles.resultsMessage, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
              {didWell 
                ? 'Excellent work! You have a strong understanding of this topic.'
                : 'Don\'t worry! Review the explanations below and try again.'}
            </Text>
          </View>

          <View style={styles.resultsQuestions}>
            <Text style={[styles.resultsQuestionsTitle, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
              Question Review
            </Text>
            
            {lesson.quiz?.questions.map((question, index) => {
              const userAnswer = quizAnswers.find(a => a.questionId === question.id);
              const isCorrect = userAnswer?.isCorrect || false;
              const isMultiSelect = question.type === 'multi-select';
              const userAnswerArray = Array.isArray(userAnswer?.selectedAnswer) ? userAnswer.selectedAnswer : [userAnswer?.selectedAnswer];
              const correctAnswerArray = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];

              return (
                <View key={index} style={[
                  styles.resultQuestionCard,
                  isCorrect ? styles.resultQuestionCardCorrect : styles.resultQuestionCardIncorrect
                ]}>
                  <View style={styles.resultQuestionHeader}>
                    <Text style={[styles.resultQuestionNumber, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                      Question {index + 1}
                      {isMultiSelect && <Text style={styles.multiSelectBadge}> (Multi-Select)</Text>}
                    </Text>
                    <View style={[styles.resultBadge, isCorrect ? styles.resultBadgeCorrect : styles.resultBadgeIncorrect]}>
                      <IconSymbol
                        ios_icon_name={isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill"}
                        android_material_icon_name={isCorrect ? "check-circle" : "cancel"}
                        size={16}
                        color="#FFFFFF"
                      />
                      <Text style={[styles.resultBadgeText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.resultQuestionText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                    {question.question}
                  </Text>

                  {question.options && (
                    <View style={styles.resultOptionsContainer}>
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswerArray.includes(option);
                        const isCorrectAnswer = correctAnswerArray.includes(option);

                        return (
                          <View
                            key={optionIndex}
                            style={[
                              styles.resultOption,
                              isCorrectAnswer && styles.resultOptionCorrect,
                              isUserAnswer && !isCorrect && styles.resultOptionWrong,
                            ]}
                          >
                            <Text style={[
                              styles.resultOptionText,
                              settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                              (isCorrectAnswer || (isUserAnswer && !isCorrect)) && styles.resultOptionTextBold
                            ]}>
                              {option}
                            </Text>
                            {isCorrectAnswer && (
                              <IconSymbol
                                ios_icon_name="checkmark.circle.fill"
                                android_material_icon_name="check-circle"
                                size={20}
                                color={colors.success}
                              />
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <IconSymbol
                                ios_icon_name="xmark.circle.fill"
                                android_material_icon_name="cancel"
                                size={20}
                                color={colors.error}
                              />
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}

                  <View style={styles.resultExplanationContainer}>
                    <Text style={[styles.resultExplanationLabel, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                      {isCorrect ? 'Why this is correct:' : 'Why the correct answer is:'}
                    </Text>
                    <Text style={[styles.resultExplanationText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                      {question.explanation}
                    </Text>
                    {!isCorrect && (
                      <View style={styles.correctAnswerBox}>
                        <Text style={[styles.correctAnswerLabel, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                          Correct Answer{isMultiSelect ? 's' : ''}:
                        </Text>
                        {correctAnswerArray.map((ans, idx) => (
                          <Text key={idx} style={[styles.correctAnswerText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                            {isMultiSelect ? `• ${ans}` : ans}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={[buttonStyles.primary, styles.restartButton]}
            onPress={handleRestartQuiz}
          >
            <IconSymbol
              ios_icon_name="arrow.clockwise"
              android_material_icon_name="refresh"
              size={18}
              color="#FFFFFF"
            />
            <Text style={buttonStyles.textWhite}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderQuizQuestion = () => {
    if (!currentQuestion) return null;

    const isMultiSelect = currentQuestion.type === 'multi-select';

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <View style={styles.quizQuestionContainer}>
          <View style={styles.quizProgress}>
            <Text style={[styles.quizProgressText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
              Question {currentQuestionIndex + 1} of {lesson.quiz?.questions.length}
            </Text>
            <View style={styles.quizProgressBar}>
              <View 
                style={[
                  styles.quizProgressBarFill,
                  { width: `${((currentQuestionIndex + 1) / (lesson.quiz?.questions.length || 1)) * 100}%` }
                ]}
              />
            </View>
          </View>

          <View style={styles.quizQuestionCard}>
            <View style={styles.quizQuestionHeader}>
              <View style={styles.marksBadge}>
                <Text style={[styles.marksText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                  {currentQuestion.marks} marks
                </Text>
              </View>
              {isMultiSelect && (
                <View style={[styles.marksBadge, { backgroundColor: colors.highlight }]}>
                  <Text style={[styles.marksText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                    Multi-Select
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.quizQuestionText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
              {currentQuestion.question}
            </Text>

            {isMultiSelect && (
              <Text style={[styles.multiSelectHint, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                Select all correct answers
              </Text>
            )}

            {currentQuestion.options && (
              <View style={styles.quizOptionsContainer}>
                {currentQuestion.options.map((option, index) => {
                  const isSelected = isMultiSelect 
                    ? selectedAnswers.includes(option)
                    : selectedAnswer === option;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.quizOption,
                        isSelected && styles.quizOptionSelected,
                        settings.accessibility.highContrast && styles.highContrastCard
                      ]}
                      onPress={() => handleSelectAnswer(option)}
                    >
                      <View style={[
                        isMultiSelect ? styles.quizOptionCheckbox : styles.quizOptionRadio,
                        isSelected && (isMultiSelect ? styles.quizOptionCheckboxSelected : styles.quizOptionRadioSelected)
                      ]}>
                        {isSelected && (
                          isMultiSelect ? (
                            <IconSymbol
                              ios_icon_name="checkmark"
                              android_material_icon_name="check"
                              size={16}
                              color="#FFFFFF"
                            />
                          ) : (
                            <View style={styles.quizOptionRadioInner} />
                          )
                        )}
                      </View>
                      <Text style={[
                        styles.quizOptionText,
                        isSelected && styles.quizOptionTextSelected,
                        settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {currentQuestion.hint && (
              <View style={styles.hintContainer}>
                <IconSymbol
                  ios_icon_name="lightbulb.fill"
                  android_material_icon_name="lightbulb"
                  size={16}
                  color={colors.highlight}
                />
                <Text style={[styles.hintText, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
                  {currentQuestion.hint}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              buttonStyles.primary,
              styles.submitAnswerButton,
              ((isMultiSelect && selectedAnswers.length === 0) || (!isMultiSelect && !selectedAnswer)) && styles.submitAnswerButtonDisabled
            ]}
            onPress={handleSubmitAnswer}
            disabled={(isMultiSelect && selectedAnswers.length === 0) || (!isMultiSelect && !selectedAnswer)}
          >
            <Text style={buttonStyles.textWhite}>
              {currentQuestionIndex < (lesson.quiz?.questions.length || 0) - 1 ? 'Next Question' : 'Finish Quiz'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderQuiz = () => {
    if (!lesson.quiz) {
      return (
        <View style={[styles.tabContent, styles.emptyStateContainer]}>
          <IconSymbol
            ios_icon_name="checkmark.circle"
            android_material_icon_name="check-circle"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyStateTitle, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
            No Quiz Yet
          </Text>
          <Text style={[styles.emptyStateDescription, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
            Generate a quiz with exam-style questions to test your knowledge
            {lesson.selectedQuotes && lesson.selectedQuotes.length > 0 && ` including quote analysis`}
          </Text>
          <TouchableOpacity
            style={[buttonStyles.primary, styles.generateContentButton]}
            onPress={handleGenerateQuiz}
            disabled={isGenerating}
          >
            {isGenerating && generatingType === 'quiz' ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <IconSymbol
                  ios_icon_name="sparkles"
                  android_material_icon_name="auto-awesome"
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={buttonStyles.textWhite}>Generate Quiz</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    if (showResults) {
      return renderQuizResults();
    }

    if (!quizStarted) {
      return (
        <View style={[styles.tabContent, styles.emptyStateContainer]}>
          <IconSymbol
            ios_icon_name="play.circle.fill"
            android_material_icon_name="play-circle"
            size={64}
            color={colors.primary}
          />
          <Text style={[styles.emptyStateTitle, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
            Ready to Start?
          </Text>
          <Text style={[styles.emptyStateDescription, settings.accessibility.dyslexiaFont && styles.dyslexiaFont]}>
            Test your knowledge with {lesson.quiz.questions.length} questions
          </Text>
          <TouchableOpacity
            style={[buttonStyles.primary, styles.generateContentButton]}
            onPress={handleStartQuiz}
          >
            <IconSymbol
              ios_icon_name="play.fill"
              android_material_icon_name="play-arrow"
              size={18}
              color="#FFFFFF"
            />
            <Text style={buttonStyles.textWhite}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return renderQuizQuestion();
  };

  const containerStyle = settings.theme.mode === 'dark' 
    ? [commonStyles.container, styles.darkContainer]
    : commonStyles.container;

  return (
    <View style={containerStyle}>
      <View style={[
        styles.header,
        settings.theme.mode === 'dark' && styles.darkHeader
      ]}>
        <TouchableOpacity style={[
          styles.backButton,
          settings.theme.mode === 'dark' && styles.darkCard
        ]} onPress={() => router.back()}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={settings.theme.mode === 'dark' ? '#FFFFFF' : colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[
            styles.headerTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            settings.theme.mode === 'dark' && styles.darkText
          ]} numberOfLines={1}>
            {lesson.name}
          </Text>
          <View style={styles.headerBadges}>
            <View style={styles.headerBadge}>
              <Text style={[
                styles.headerBadgeText,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont
              ]}>
                {lesson.level}
              </Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={[
                styles.headerBadgeText,
                settings.accessibility.dyslexiaFont && styles.dyslexiaFont
              ]}>
                {lesson.difficulty}
              </Text>
            </View>
            {lesson.selectedQuotes && lesson.selectedQuotes.length > 0 && (
              <View style={[styles.headerBadge, { backgroundColor: colors.highlight + '30' }]}>
                <Text style={[
                  styles.headerBadgeText,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont
                ]}>
                  {lesson.selectedQuotes.length} Quotes
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={[
        styles.tabBar,
        settings.theme.mode === 'dark' && styles.darkCard
      ]}>
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
              settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
              settings.theme.mode === 'dark' && styles.darkText
            ]}
          >
            Notes
          </Text>
          {!lesson.notes && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>New</Text>
            </View>
          )}
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
              settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
              settings.theme.mode === 'dark' && styles.darkText
            ]}
          >
            Flashcards
          </Text>
          {!user?.isPremium && (
            <View style={[styles.tabBadge, { backgroundColor: colors.highlight }]}>
              <Text style={styles.tabBadgeText}>Premium</Text>
            </View>
          )}
          {lesson.flashcards.length === 0 && user?.isPremium && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>New</Text>
            </View>
          )}
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
              settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
              settings.theme.mode === 'dark' && styles.darkText
            ]}
          >
            Quiz
          </Text>
          {!lesson.quiz && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>New</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {activeTab === 'notes' && renderNotes()}
      {activeTab === 'flashcards' && renderFlashcards()}
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
  darkHeader: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333333',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  darkCard: {
    backgroundColor: '#1a1a1a',
  },
  darkText: {
    color: '#FFFFFF',
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
    flexWrap: 'wrap',
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
    position: 'relative',
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
  tabBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.highlight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.highlight + '15',
    marginBottom: 16,
  },
  premiumBannerText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  generateContentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  notesButtonContainer: {
    width: '100%',
    gap: 12,
  },
  subtopicInputContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    gap: 12,
  },
  subtopicLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  subtopicExample: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  subtopicButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  flashcardOptionsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    gap: 12,
  },
  flashcardOptionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  flashcardOptionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  flashcardOptionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  flashcardOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  flashcardOptionTextSelected: {
    color: colors.primary,
  },
  flashcardOptionsButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
  quizQuestionContainer: {
    padding: 20,
  },
  quizProgress: {
    marginBottom: 24,
  },
  quizProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  quizProgressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  quizProgressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  quizQuestionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  quizQuestionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    gap: 8,
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
  quizQuestionText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  multiSelectHint: {
    fontSize: 13,
    color: colors.highlight,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  multiSelectBadge: {
    fontSize: 12,
    color: colors.highlight,
    fontWeight: '600',
  },
  quizOptionsContainer: {
    gap: 12,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    gap: 12,
  },
  quizOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  quizOptionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizOptionRadioSelected: {
    borderColor: colors.primary,
  },
  quizOptionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  quizOptionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizOptionCheckboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  quizOptionText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  quizOptionTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.highlight + '10',
    marginTop: 16,
    gap: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
    fontStyle: 'italic',
  },
  submitAnswerButton: {
    marginTop: 8,
  },
  submitAnswerButtonDisabled: {
    opacity: 0.5,
  },
  resultsContainer: {
    padding: 20,
  },
  resultsHeader: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  resultsHeaderSuccess: {
    backgroundColor: colors.success + '15',
  },
  resultsHeaderWarning: {
    backgroundColor: colors.warning + '15',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
  },
  resultsMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  resultsQuestions: {
    marginBottom: 24,
  },
  resultsQuestionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  resultQuestionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  resultQuestionCardCorrect: {
    borderLeftColor: colors.success,
  },
  resultQuestionCardIncorrect: {
    borderLeftColor: colors.error,
  },
  resultQuestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultQuestionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  resultBadgeCorrect: {
    backgroundColor: colors.success,
  },
  resultBadgeIncorrect: {
    backgroundColor: colors.error,
  },
  resultBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultQuestionText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 16,
  },
  resultOptionsContainer: {
    marginBottom: 16,
    gap: 8,
  },
  resultOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultOptionCorrect: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success,
  },
  resultOptionWrong: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error,
  },
  resultOptionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  resultOptionTextBold: {
    fontWeight: '600',
  },
  resultExplanationContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  resultExplanationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  resultExplanationText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  correctAnswerBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.success + '10',
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  correctAnswerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
    marginBottom: 4,
  },
  correctAnswerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 16,
  },
  dyslexiaFont: {
    fontFamily: 'OpenDyslexic',
  },
  highContrastText: {
    color: '#000000',
  },
  highContrastInput: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  highContrastCard: {
    borderWidth: 2,
    borderColor: '#000000',
  },
});
