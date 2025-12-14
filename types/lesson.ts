
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
  type: 'multiple-choice' | 'multi-select' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer: string | string[]; // Can be single answer or array for multi-select
  explanation: string;
  hint?: string;
  marks: number;
  userAnswer?: string | string[];
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
  book?: string; // For literature books like "A Christmas Carol"
  selectedQuotes?: string[]; // Selected quotes for the lesson
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
  subSubject?: string; // For BTEC Sport sub-subjects like "Anatomy & Physiology"
  level: Level;
  lessonId?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  points: number;
}

export interface PremiumGrant {
  id: string;
  userId: string;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  isPermanent: boolean;
  reason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
  premiumGrant?: PremiumGrant;
  lessons: Lesson[];
  tasks: Task[];
  streak: number;
  lastLoginDate?: Date;
  points: number;
  badges: string[];
  settings: UserSettings;
  signupDate: Date;
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
  books?: string[]; // For subjects with specific books to study
  subSubjects?: string[]; // For BTEC subjects with sub-subjects
  quotes?: Record<string, string[]>; // Quotes for each book
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'update' | 'reminder' | 'alert';
  targetUsers: 'all' | 'premium' | 'free' | string[];
  createdAt: Date;
  createdBy: string;
  read: boolean;
}

export interface AppSettings {
  aiGenerationLimit: number;
  defaultTaskCount: number;
  maintenanceMode: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}
