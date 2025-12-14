
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLesson } from '@/contexts/LessonContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Subject, Level, Difficulty } from '@/types/lesson';

const subjects: Subject[] = [
  'Mathematics',
  'English',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Computer Science',
  'Business Studies',
  'Economics',
  'Psychology',
  'Art',
  'Music',
];

const levels: Level[] = ['GCSE', 'A-Level'];
const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export default function CreateLessonScreen() {
  const router = useRouter();
  const { createLesson } = useLesson();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateLesson = async () => {
    if (!selectedSubject || !selectedLevel || !selectedDifficulty) {
      Alert.alert('Error', 'Please select subject, level, and difficulty');
      return;
    }

    setIsGenerating(true);
    try {
      const newLesson = await createLesson(selectedSubject, selectedLevel, selectedDifficulty);
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
    } finally {
      setIsGenerating(false);
    }
  };

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isGenerating ? (
          <View style={styles.generatingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[commonStyles.subtitle, styles.generatingTitle]}>
              Generating Your Lesson
            </Text>
            <Text style={[commonStyles.textSecondary, styles.generatingText]}>
              AI is creating personalized content for you...
            </Text>
            <View style={styles.generatingSteps}>
              <GeneratingStep text="Creating lesson notes" />
              <GeneratingStep text="Generating flashcards" />
              <GeneratingStep text="Preparing exam questions" />
              <GeneratingStep text="Building quiz" />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={commonStyles.subtitle}>Select Subject</Text>
              <Text style={[commonStyles.textSecondary, styles.sectionDescription]}>
                Choose the subject you want to study
              </Text>
              <View style={styles.optionsGrid}>
                {subjects.map((subject, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={[
                        styles.optionCard,
                        selectedSubject === subject && styles.optionCardSelected,
                      ]}
                      onPress={() => setSelectedSubject(subject)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedSubject === subject && styles.optionTextSelected,
                        ]}
                      >
                        {subject}
                      </Text>
                      {selectedSubject === subject && (
                        <View style={styles.checkmark}>
                          <IconSymbol
                            ios_icon_name="checkmark"
                            android_material_icon_name="check"
                            size={16}
                            color="#FFFFFF"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={commonStyles.subtitle}>Select Level</Text>
              <Text style={[commonStyles.textSecondary, styles.sectionDescription]}>
                Choose your education level
              </Text>
              <View style={styles.optionsRow}>
                {levels.map((level, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={[
                        styles.levelCard,
                        selectedLevel === level && styles.levelCardSelected,
                      ]}
                      onPress={() => setSelectedLevel(level)}
                    >
                      <Text
                        style={[
                          styles.levelText,
                          selectedLevel === level && styles.levelTextSelected,
                        ]}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={commonStyles.subtitle}>Select Difficulty</Text>
              <Text style={[commonStyles.textSecondary, styles.sectionDescription]}>
                Choose the difficulty level
              </Text>
              <View style={styles.optionsRow}>
                {difficulties.map((difficulty, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={[
                        styles.difficultyCard,
                        selectedDifficulty === difficulty && styles.difficultyCardSelected,
                      ]}
                      onPress={() => setSelectedDifficulty(difficulty)}
                    >
                      <View style={styles.difficultyIndicator}>
                        {[...Array(difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3)].map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.difficultyDot,
                              selectedDifficulty === difficulty && styles.difficultyDotSelected,
                            ]}
                          />
                        ))}
                      </View>
                      <Text
                        style={[
                          styles.difficultyText,
                          selectedDifficulty === difficulty && styles.difficultyTextSelected,
                        ]}
                      >
                        {difficulty}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Lesson Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subject:</Text>
                <Text style={styles.summaryValue}>
                  {selectedSubject || 'Not selected'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Level:</Text>
                <Text style={styles.summaryValue}>
                  {selectedLevel || 'Not selected'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Difficulty:</Text>
                <Text style={styles.summaryValue}>
                  {selectedDifficulty || 'Not selected'}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {!isGenerating && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              buttonStyles.primary,
              styles.createButton,
              (!selectedSubject || !selectedLevel || !selectedDifficulty) &&
                styles.createButtonDisabled,
            ]}
            onPress={handleCreateLesson}
            disabled={!selectedSubject || !selectedLevel || !selectedDifficulty}
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
      )}
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
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionDescription: {
    marginTop: 4,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  optionCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  checkmark: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  levelCard: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  levelCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  levelTextSelected: {
    color: '#FFFFFF',
  },
  difficultyCard: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 8,
  },
  difficultyCardSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  difficultyIndicator: {
    flexDirection: 'row',
    gap: 4,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
  },
  difficultyDotSelected: {
    backgroundColor: '#FFFFFF',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  difficultyTextSelected: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  generatingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  generatingTitle: {
    marginTop: 24,
    marginBottom: 8,
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
