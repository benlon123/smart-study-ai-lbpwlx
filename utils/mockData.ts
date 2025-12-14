
import { Lesson, Subject, Level, Difficulty } from '@/types/lesson';

export const generateMockLesson = (
  subject: Subject,
  level: Level,
  difficulty: Difficulty
): Lesson => {
  const lessonId = `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: lessonId,
    title: `${subject} - ${level} ${difficulty}`,
    subject,
    level,
    difficulty,
    notes: generateMockNotes(subject, level, difficulty),
    flashcards: generateMockFlashcards(subject, 5),
    examQuestions: generateMockExamQuestions(subject, difficulty, 3),
    quiz: {
      id: `quiz-${lessonId}`,
      questions: generateMockExamQuestions(subject, difficulty, 5),
      timeLimit: 30,
      completed: false,
    },
    createdAt: new Date(),
    progress: 0,
  };
};

const generateMockNotes = (subject: Subject, level: Level, difficulty: Difficulty): string => {
  return `# ${subject} - ${level} (${difficulty})

## Introduction
This lesson covers key concepts in ${subject} at the ${level} level. The content is designed for ${difficulty.toLowerCase()} difficulty.

## Key Concepts

### Concept 1: Fundamentals
Understanding the basic principles is essential for mastering ${subject}. This section introduces the foundational ideas that will be built upon throughout the course.

**Important Terms:**
- **Term 1**: A fundamental concept in ${subject}
- **Term 2**: Another key principle to understand
- **Term 3**: Essential for exam success

### Concept 2: Application
Once you understand the fundamentals, it's important to apply them to real-world scenarios. This helps solidify your understanding and prepares you for exam questions.

### Concept 3: Advanced Topics
For ${level} students, it's crucial to explore more complex ideas. This section challenges you to think critically and make connections between different concepts.

## Practice Questions
1. Explain the main principles covered in this lesson
2. How would you apply these concepts to solve problems?
3. What are the key differences between related topics?

## Summary
This lesson has covered the essential topics in ${subject} for ${level} students. Make sure to review the flashcards and complete the practice questions to reinforce your learning.

## Next Steps
- Review flashcards daily
- Complete practice exam questions
- Take the quiz to test your understanding
- Identify areas that need more practice`;
};

const generateMockFlashcards = (subject: Subject, count: number) => {
  const flashcards = [];
  for (let i = 1; i <= count; i++) {
    flashcards.push({
      id: `flashcard-${i}-${Date.now()}`,
      question: `What is the key concept ${i} in ${subject}?`,
      answer: `This is the answer to concept ${i}. It explains the fundamental principle and how it applies to ${subject}. Understanding this concept is crucial for exam success.`,
      mastered: false,
    });
  }
  return flashcards;
};

const generateMockExamQuestions = (subject: Subject, difficulty: Difficulty, count: number) => {
  const questions = [];
  for (let i = 1; i <= count; i++) {
    const isMultipleChoice = i % 2 === 0;
    questions.push({
      id: `question-${i}-${Date.now()}`,
      question: `${difficulty} question ${i}: Explain the main principle of ${subject} related to this topic.`,
      type: isMultipleChoice ? 'multiple-choice' : 'short-answer',
      options: isMultipleChoice ? [
        'Option A: First possible answer',
        'Option B: Second possible answer',
        'Option C: Third possible answer',
        'Option D: Fourth possible answer',
      ] : undefined,
      correctAnswer: isMultipleChoice ? 'Option B: Second possible answer' : 'A detailed explanation of the concept',
      explanation: `This question tests your understanding of ${subject}. The correct answer demonstrates knowledge of the key principles and their application.`,
      marks: difficulty === 'Easy' ? 2 : difficulty === 'Medium' ? 4 : 6,
    });
  }
  return questions;
};

export const sampleLessons: Lesson[] = [
  generateMockLesson('Mathematics', 'GCSE', 'Medium'),
  generateMockLesson('English', 'A-Level', 'Hard'),
  generateMockLesson('Physics', 'GCSE', 'Easy'),
  generateMockLesson('Chemistry', 'A-Level', 'Medium'),
  generateMockLesson('Biology', 'GCSE', 'Hard'),
];
