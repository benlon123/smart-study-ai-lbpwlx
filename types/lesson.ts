
export type Subject = 
  | 'Mathematics'
  | 'English'
  | 'Science'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'History'
  | 'Geography'
  | 'Computer Science'
  | 'Business Studies'
  | 'Economics'
  | 'Psychology'
  | 'Art'
  | 'Music';

export type Level = 'GCSE' | 'A-Level';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mastered: boolean;
  lastReviewed?: Date;
}

export interface ExamQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
}

export interface Quiz {
  id: string;
  questions: ExamQuestion[];
  timeLimit?: number; // in minutes
  completed: boolean;
  score?: number;
}

export interface Lesson {
  id: string;
  title: string;
  subject: Subject;
  level: Level;
  difficulty: Difficulty;
  notes: string;
  flashcards: Flashcard[];
  examQuestions: ExamQuestion[];
  quiz?: Quiz;
  createdAt: Date;
  progress: number; // 0-100
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  lessons: Lesson[];
  streak: number;
  points: number;
  badges: string[];
}
