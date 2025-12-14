
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLesson } from '@/contexts/LessonContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Subject, Level, Difficulty } from '@/types/lesson';
import { subjectTopics } from '@/utils/mockData';

const levels: Level[] = ['GCSE', 'A-Level'];
const difficulties: Difficulty[] = ['Easy', 'Normal', 'Hard'];

export default function CreateLessonScreen() {
  const router = useRouter();
  const { createLesson } = useLesson();
  
  const [step, setStep] = useState<'level' | 'difficulty' | 'name' | 'subject'>('level');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [lessonName, setLessonName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setStep('difficulty');
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setStep('name');
  };

  const handleNameSubmit = () => {
    if (!lessonName.trim()) {
      Alert.alert('Error', 'Please enter a lesson name');
      return;
    }
    setShowSubjectModal(true);
  };

  const handleSubjectTopicSelect = async () => {
    if (!selectedSubject || !selectedTopic) {
      Alert.alert('Error', 'Please select both subject and topic');
      return;
    }

    setShowSubjectModal(false);
    setIsGenerating(true);

    try {
      const newLesson = await createLesson(
        lessonName,
        selectedSubject,
        selectedTopic,
        selectedLevel!,
        selectedDifficulty!
      );
      
      Alert.alert(
        'Success! 🎉',
        'Your lesson has been created with AI-generated content',
        [
          {
            text: 'View Lesson',
            onPress: () => {
              router.back();
              router.push(`/lesson/${newLesson.id}`);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create lesson');
      setIsGenerating(false);
    }
  };

  const renderLevelStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Level</Text>
      <Text style={styles.stepDescription}>Choose your education level</Text>
      
      <View style={styles.optionsContainer}>
        {levels.map((level, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={styles.levelCard}
              onPress={() => handleLevelSelect(level)}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="graduationcap.fill"
                android_material_icon_name="school"
                size={40}
                color={colors.primary}
              />
              <Text style={styles.levelCardTitle}>{level}</Text>
              <Text style={styles.levelCardDescription}>
                {level === 'GCSE' ? 'Ages 14-16' : 'Ages 16-18'}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  const renderDifficultyStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Difficulty</Text>
      <Text style={styles.stepDescription}>Choose the challenge level</Text>
      
      <View style={styles.optionsContainer}>
        {difficulties.map((difficulty, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={styles.difficultyCard}
              onPress={() => handleDifficultySelect(difficulty)}
              activeOpacity={0.7}
            >
              <View style={styles.difficultyIndicator}>
                {[...Array(difficulty === 'Easy' ? 1 : difficulty === 'Normal' ? 2 : 3)].map((_, i) => (
                  <View key={i} style={styles.difficultyDot} />
                ))}
              </View>
              <Text style={styles.difficultyCardTitle}>{difficulty}</Text>
              <Text style={styles.difficultyCardDescription}>
                {difficulty === 'Easy' ? 'Foundation level' : difficulty === 'Normal' ? 'Intermediate level' : 'Advanced level'}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  const renderNameStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Name Your Lesson</Text>
      <Text style={styles.stepDescription}>Give your lesson a memorable name</Text>
      
      <View style={styles.nameInputContainer}>
        <TextInput
          style={styles.nameInput}
          placeholder="e.g., Quadratic Equations Basics"
          placeholderTextColor={colors.textSecondary}
          value={lessonName}
          onChangeText={setLessonName}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={handleNameSubmit}
        />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Lesson Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Level:</Text>
          <Text style={styles.summaryValue}>{selectedLevel}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Difficulty:</Text>
          <Text style={styles.summaryValue}>{selectedDifficulty}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Name:</Text>
          <Text style={styles.summaryValue}>{lessonName || 'Not entered'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[buttonStyles.primary, styles.continueButton, !lessonName.trim() && styles.continueButtonDisabled]}
        onPress={handleNameSubmit}
        disabled={!lessonName.trim()}
      >
        <Text style={buttonStyles.textWhite}>Continue to Subject Selection</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSubjectModal = () => (
    <Modal
      visible={showSubjectModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowSubjectModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowSubjectModal(false)}
          >
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Select Subject & Topic</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.modalSectionTitle}>Choose Subject</Text>
          <View style={styles.subjectGrid}>
            {subjectTopics.map((item, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.subjectChip,
                    selectedSubject === item.subject && styles.subjectChipSelected,
                  ]}
                  onPress={() => {
                    setSelectedSubject(item.subject);
                    setSelectedTopic(null);
                  }}
                >
                  <Text
                    style={[
                      styles.subjectChipText,
                      selectedSubject === item.subject && styles.subjectChipTextSelected,
                    ]}
                  >
                    {item.subject}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>

          {selectedSubject && (
            <>
              <Text style={[styles.modalSectionTitle, { marginTop: 24 }]}>Choose Topic</Text>
              <View style={styles.topicGrid}>
                {subjectTopics
                  .find(item => item.subject === selectedSubject)
                  ?.topics.map((topic, index) => (
                    <React.Fragment key={index}>
                      <TouchableOpacity
                        style={[
                          styles.topicChip,
                          selectedTopic === topic && styles.topicChipSelected,
                        ]}
                        onPress={() => setSelectedTopic(topic)}
                      >
                        <Text
                          style={[
                            styles.topicChipText,
                            selectedTopic === topic && styles.topicChipTextSelected,
                          ]}
                        >
                          {topic}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  ))}
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[
              buttonStyles.primary,
              styles.generateButton,
              (!selectedSubject || !selectedTopic) && styles.generateButtonDisabled,
            ]}
            onPress={handleSubjectTopicSelect}
            disabled={!selectedSubject || !selectedTopic}
          >
            <IconSymbol
              ios_icon_name="sparkles"
              android_material_icon_name="auto-awesome"
              size={20}
              color="#FFFFFF"
            />
            <Text style={buttonStyles.textWhite}>Generate Lesson with AI</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderGenerating = () => (
    <View style={styles.generatingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[commonStyles.subtitle, styles.generatingTitle]}>
        Generating Your Lesson
      </Text>
      <Text style={[commonStyles.textSecondary, styles.generatingText]}>
        AI is creating personalized content for you...
      </Text>
      <View style={styles.generatingSteps}>
        <GeneratingStep text="Analyzing subject and topic" />
        <GeneratingStep text="Creating comprehensive notes" />
        <GeneratingStep text="Generating flashcards with spaced repetition" />
        <GeneratingStep text="Preparing exam-style questions" />
        <GeneratingStep text="Building interactive quiz" />
      </View>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          disabled={isGenerating}
        >
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Lesson</Text>
        <View style={{ width: 40 }} />
      </View>

      {isGenerating ? (
        renderGenerating()
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 'level' && renderLevelStep()}
          {step === 'difficulty' && renderDifficultyStep()}
          {step === 'name' && renderNameStep()}
        </ScrollView>
      )}

      {renderSubjectModal()}
    </View>
  );
}

const GeneratingStep = ({ text }: { text: string }) => (
  <View style={styles.generatingStep}>
    <View style={styles.generatingStepDot} />
    <Text style={styles.generatingStepText}>{text}</Text>
  </View>
);

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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  levelCard: {
    backgroundColor: colors.card,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  levelCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  levelCardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  difficultyCard: {
    backgroundColor: colors.card,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  difficultyIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  difficultyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  difficultyCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  difficultyCardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  nameInputContainer: {
    marginBottom: 24,
  },
  nameInput: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  continueButton: {
    marginTop: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subjectChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  subjectChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  subjectChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  subjectChipTextSelected: {
    color: '#FFFFFF',
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topicChipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  topicChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  topicChipTextSelected: {
    color: '#FFFFFF',
  },
  modalFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generatingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  generatingTitle: {
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  generatingText: {
    textAlign: 'center',
    marginBottom: 40,
  },
  generatingSteps: {
    width: '100%',
    gap: 16,
  },
  generatingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  generatingStepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  generatingStepText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
