
import React, { createContext, useContext, useState } from 'react';
import { Lesson, Subject, Level, Difficulty } from '@/types/lesson';
import { 
  generateMockLesson, 
  sampleLessons, 
  generateMockFlashcards, 
  generateMockExamQuestions,
  generateMockQuiz 
} from '@/utils/mockData';

interface LessonContextType {
  lessons: Lesson[];
  createLesson: (
    name: string,
    subject: Subject,
    topic: string,
    level: Level,
    difficulty: Difficulty
  ) => Promise<Lesson>;
  generateRemainingContent: (lessonId: string) => Promise<void>;
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
    difficulty: Difficulty
  ): Promise<Lesson> => {
    try {
      console.log('Creating lesson with notes only...');
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const newLesson = generateMockLesson(name, subject, topic, level, difficulty);
      setLessons(prev => [newLesson, ...prev]);
      
      console.log('Lesson created with notes:', newLesson);
      return newLesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw new Error('Failed to create lesson. Please try again.');
    }
  };

  const generateRemainingContent = async (lessonId: string): Promise<void> => {
    try {
      console.log('Generating remaining content for lesson:', lessonId);
      
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const flashcards = generateMockFlashcards(lesson.subject, lesson.topic, 8);
      const examQuestions = generateMockExamQuestions(lesson.subject, lesson.topic, lesson.difficulty, 5);
      const quiz = generateMockQuiz(lesson.subject, lesson.topic, lesson.difficulty, lessonId);

      setLessons(prev =>
        prev.map(l =>
          l.id === lessonId
            ? { ...l, flashcards, examQuestions, quiz }
            : l
        )
      );

      console.log('Remaining content generated successfully');
    } catch (error) {
      console.error('Error generating remaining content:', error);
      throw new Error('Failed to generate content. Please try again.');
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
        generateRemainingContent,
        deleteLesson,
        updateLessonProgress,
        getLessonById,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};
