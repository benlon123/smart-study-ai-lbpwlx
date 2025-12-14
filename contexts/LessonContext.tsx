
import React, { createContext, useContext, useState } from 'react';
import { Lesson, Subject, Level, Difficulty } from '@/types/lesson';
import { 
  generateMockLesson, 
  sampleLessons, 
  generateMockFlashcards, 
  generateMockExamQuestions,
  generateMockQuiz,
  generateMockNotes
} from '@/utils/mockData';

interface LessonContextType {
  lessons: Lesson[];
  createLesson: (
    name: string,
    subject: Subject,
    topic: string,
    level: Level,
    difficulty: Difficulty,
    book?: string,
    selectedQuotes?: string[]
  ) => Promise<Lesson>;
  generateNotes: (lessonId: string, subtopic?: string) => Promise<void>;
  generateFlashcards: (lessonId: string, count: 10 | 20 | 30) => Promise<void>;
  generateQuiz: (lessonId: string) => Promise<void>;
  deleteLesson: (lessonId: string) => void;
  updateLessonProgress: (lessonId: string, progress: number) => void;
  getLessonById: (lessonId: string) => Lesson | undefined;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const useLesson = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson must be used within a LessonProvider');
  }
  return context;
};

export const LessonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lessons, setLessons] = useState<Lesson[]>(sampleLessons);

  const createLesson = async (
    name: string,
    subject: Subject,
    topic: string,
    level: Level,
    difficulty: Difficulty,
    book?: string,
    selectedQuotes?: string[]
  ): Promise<Lesson> => {
    try {
      console.log('Creating lesson container only (no content)...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLesson = generateMockLesson(name, subject, topic, level, difficulty, book, selectedQuotes);
      setLessons(prev => [newLesson, ...prev]);
      
      console.log('Lesson container created:', newLesson);
      return newLesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw new Error('Failed to create lesson. Please try again.');
    }
  };

  const generateNotes = async (lessonId: string, subtopic?: string): Promise<void> => {
    try {
      console.log('Generating notes for lesson:', lessonId, 'Subtopic:', subtopic);
      
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      if (lesson.notes) {
        throw new Error('Notes already generated for this lesson');
      }

      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const notes = generateMockNotes(
        lesson.subject, 
        subtopic || lesson.topic, 
        lesson.level, 
        lesson.difficulty,
        lesson.book,
        lesson.selectedQuotes
      );

      setLessons(prev =>
        prev.map(l =>
          l.id === lessonId
            ? { ...l, notes }
            : l
        )
      );

      console.log('Notes generated successfully');
    } catch (error) {
      console.error('Error generating notes:', error);
      throw error;
    }
  };

  const generateFlashcards = async (lessonId: string, count: 10 | 20 | 30): Promise<void> => {
    try {
      console.log('Generating', count, 'flashcards for lesson:', lessonId);
      
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      if (lesson.flashcards.length > 0) {
        throw new Error('Flashcards already generated for this lesson');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const flashcards = generateMockFlashcards(lesson.subject, lesson.topic, count, lesson.book, lesson.selectedQuotes);

      setLessons(prev =>
        prev.map(l =>
          l.id === lessonId
            ? { ...l, flashcards }
            : l
        )
      );

      console.log('Flashcards generated successfully');
    } catch (error) {
      console.error('Error generating flashcards:', error);
      throw error;
    }
  };

  const generateQuiz = async (lessonId: string): Promise<void> => {
    try {
      console.log('Generating quiz for lesson:', lessonId);
      
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      if (lesson.quiz) {
        throw new Error('Quiz already generated for this lesson');
      }

      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const examQuestions = generateMockExamQuestions(lesson.subject, lesson.topic, lesson.difficulty, 5, lesson.book, lesson.selectedQuotes);
      const quiz = generateMockQuiz(lesson.subject, lesson.topic, lesson.difficulty, lessonId, lesson.book, lesson.selectedQuotes);

      setLessons(prev =>
        prev.map(l =>
          l.id === lessonId
            ? { ...l, examQuestions, quiz }
            : l
        )
      );

      console.log('Quiz generated successfully');
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  };

  const deleteLesson = (lessonId: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
    console.log('Lesson deleted:', lessonId);
  };

  const updateLessonProgress = (lessonId: string, progress: number) => {
    setLessons(prev =>
      prev.map(lesson =>
        lesson.id === lessonId ? { ...lesson, progress } : lesson
      )
    );
    console.log('Lesson progress updated:', lessonId, progress);
  };

  const getLessonById = (lessonId: string) => {
    return lessons.find(lesson => lesson.id === lessonId);
  };

  return (
    <LessonContext.Provider
      value={{
        lessons,
        createLesson,
        generateNotes,
        generateFlashcards,
        generateQuiz,
        deleteLesson,
        updateLessonProgress,
        getLessonById,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};
