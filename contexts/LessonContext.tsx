
import React, { createContext, useContext, useState } from 'react';
import { Lesson, Subject, Level, Difficulty } from '@/types/lesson';
import { generateMockLesson, sampleLessons } from '@/utils/mockData';

interface LessonContextType {
  lessons: Lesson[];
  createLesson: (subject: Subject, level: Level, difficulty: Difficulty) => Promise<Lesson>;
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
    subject: Subject,
    level: Level,
    difficulty: Difficulty
  ): Promise<Lesson> => {
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newLesson = generateMockLesson(subject, level, difficulty);
      setLessons(prev => [newLesson, ...prev]);
      
      console.log('Lesson created:', newLesson);
      return newLesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw new Error('Failed to create lesson. Please try again.');
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
        deleteLesson,
        updateLessonProgress,
        getLessonById,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};
