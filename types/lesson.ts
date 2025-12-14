
export type Subject = 
  | 'Mathematics'
  | 'English Language'
  | 'English Literature'
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
  | 'Sociology'
  | 'Art & Design'
  | 'Music'
  | 'Drama'
  | 'Physical Education'
  | 'Religious Studies'
  | 'French'
  | 'Spanish'
  | 'German'
  | 'Media Studies'
  | 'Design & Technology'
  | 'Food Technology'
  | 'BTEC Business'
  | 'BTEC Sport'
  | 'BTEC Health & Social Care'
  | 'BTEC IT'
  | 'BTEC Engineering'
  | 'BTEC Applied Science';

export type Level = 'GCSE' | 'A-Level';

export type Difficulty = 'Easy' | 'Normal' | 'Hard';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mastered: boolean;
  lastReviewed?: Date;
  nextReview?: Date;
}

export interface ExamQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  marks: number;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface Quiz {
  id: string;
  questions: ExamQuestion[];
  timeLimit?: number;
  completed: boolean;
  score?: number;
  completedAt?: Date;
}

export interface Lesson {
  id: string;
  name: string;
  title: string;
  subject: Subject;
  topic: string;
  level: Level;
  difficulty: Difficulty;
  description: string;
  notes: string;
  flashcards: Flashcard[];
  examQuestions: ExamQuestion[];
  quiz?: Quiz;
  createdAt: Date;
  progress: number;
}

export interface Task {
  id: string;
  type: 'lesson' | 'flashcards' | 'notes' | 'quiz' | 'timed-challenge';
  title: string;
  subject: Subject;
  level: Level;
  lessonId?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  points: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  lessons: Lesson[];
  tasks: Task[];
  streak: number;
  points: number;
  badges: string[];
  settings: UserSettings;
}

export interface UserSettings {
  accessibility: {
    dyslexiaFont: boolean;
    textSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    screenReader: boolean;
    voiceCommands: boolean;
  };
  theme: {
    mode: 'light' | 'dark' | 'auto';
    customColors: boolean;
    eyeStrainReduction: boolean;
    studySounds: boolean;
  };
  notifications: {
    taskAlerts: boolean;
    examReminders: boolean;
    aiStudyReminders: boolean;
    dailyReminders: boolean;
  };
  study: {
    defaultDifficulty: Difficulty;
    defaultSubjects: Subject[];
    sessionLength: number;
    pomodoroEnabled: boolean;
  };
  gamification: {
    showBadges: boolean;
    showPoints: boolean;
    showLeaderboard: boolean;
  };
}

export interface SubjectTopic {
  subject: Subject;
  topics: string[];
}
