
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PremiumGrant } from '@/types/lesson';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  updateStreak: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user database
const mockUsers: User[] = [];

// Helper function to check if two dates are consecutive days
const areConsecutiveDays = (date1: Date, date2: Date): boolean => {
  const day1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const day2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diffTime = Math.abs(day2.getTime() - day1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  // Update streak when user logs in
  useEffect(() => {
    if (user) {
      updateStreak();
    }
  }, [user?.id]);

  const checkSession = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking session:', error);
      setIsLoading(false);
    }
  };

  const updateStreak = () => {
    if (!user) return;

    const today = new Date();
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;

    console.log('Updating streak - Today:', today, 'Last Login:', lastLogin);

    if (!lastLogin) {
      // First login ever
      const updatedUser = {
        ...user,
        streak: 1,
        lastLoginDate: today,
      };
      setUser(updatedUser);
      updateUserInDatabase(updatedUser);
      console.log('First login - Streak set to 1');
      return;
    }

    if (isSameDay(today, lastLogin)) {
      // Already logged in today, no change
      console.log('Already logged in today - No streak change');
      return;
    }

    if (areConsecutiveDays(lastLogin, today)) {
      // Consecutive day login - increment streak
      const updatedUser = {
        ...user,
        streak: user.streak + 1,
        lastLoginDate: today,
      };
      setUser(updatedUser);
      updateUserInDatabase(updatedUser);
      console.log('Consecutive day login - Streak incremented to:', updatedUser.streak);
    } else {
      // Missed a day - reset streak to 1
      const updatedUser = {
        ...user,
        streak: 1,
        lastLoginDate: today,
      };
      setUser(updatedUser);
      updateUserInDatabase(updatedUser);
      console.log('Missed a day - Streak reset to 1');
    }
  };

  const updateUserInDatabase = (updatedUser: User) => {
    const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        isPremium: false,
        lessons: [],
        tasks: [],
        streak: 1,
        points: 0,
        badges: [],
        lastLoginDate: new Date(),
        settings: {
          accessibility: {
            dyslexiaFont: false,
            textSize: 'medium',
            highContrast: false,
            screenReader: false,
            voiceCommands: false,
          },
          theme: {
            mode: 'light',
            customColors: false,
            eyeStrainReduction: false,
            studySounds: false,
          },
          notifications: {
            taskAlerts: true,
            examReminders: true,
            aiStudyReminders: true,
            dailyReminders: false,
          },
          study: {
            defaultDifficulty: 'Normal',
            defaultSubjects: [],
            sessionLength: 25,
            pomodoroEnabled: false,
          },
          gamification: {
            showBadges: true,
            showPoints: true,
            showLeaderboard: true,
          },
        },
        signupDate: new Date(),
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      console.log('User signed up:', newUser);
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error('Failed to sign up. Please try again.');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let existingUser = mockUsers.find(u => u.email === email);
      
      if (!existingUser) {
        existingUser = {
          id: `user-${Date.now()}`,
          name: email === 'blonergan55@gmail.com' ? 'Admin User' : 'Test User',
          email,
          isPremium: false,
          lessons: [],
          tasks: [],
          streak: 0,
          points: 250,
          badges: ['First Lesson', 'Week Streak'],
          lastLoginDate: undefined,
          settings: {
            accessibility: {
              dyslexiaFont: false,
              textSize: 'medium',
              highContrast: false,
              screenReader: false,
              voiceCommands: false,
            },
            theme: {
              mode: 'light',
              customColors: false,
              eyeStrainReduction: false,
              studySounds: false,
            },
            notifications: {
              taskAlerts: true,
              examReminders: true,
              aiStudyReminders: true,
              dailyReminders: false,
            },
            study: {
              defaultDifficulty: 'Normal',
              defaultSubjects: [],
              sessionLength: 25,
              pomodoroEnabled: false,
            },
            gamification: {
              showBadges: true,
              showPoints: true,
              showLeaderboard: true,
            },
          },
          signupDate: new Date(),
        };
        mockUsers.push(existingUser);
      }
      
      setUser(existingUser);
      console.log('User signed in:', existingUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error('Failed to sign in. Please check your credentials.');
    }
  };

  const signOut = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out.');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error('Failed to send password reset email.');
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      updateUserInDatabase(updatedUser);
      console.log('User updated:', updatedUser);
    }
  };

  const isAdmin = user?.email === 'blonergan55@gmail.com';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        forgotPassword,
        updateUser,
        updateStreak,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export function to get all users (for admin)
export const getAllUsers = (): User[] => {
  return mockUsers;
};

// Export function to find user by email or name
export const findUserByEmailOrName = (searchTerm: string): User | undefined => {
  return mockUsers.find(u => 
    u.email.toLowerCase() === searchTerm.toLowerCase() || 
    u.name.toLowerCase() === searchTerm.toLowerCase()
  );
};

// Export function to grant premium
export const grantPremiumToUser = (
  userId: string, 
  grantedBy: string, 
  isPermanent: boolean, 
  expiresAt?: Date,
  reason?: string
): boolean => {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    const grant: PremiumGrant = {
      id: `grant-${Date.now()}`,
      userId,
      grantedBy,
      grantedAt: new Date(),
      expiresAt,
      isPermanent,
      reason,
    };
    
    mockUsers[userIndex].isPremium = true;
    mockUsers[userIndex].premiumGrant = grant;
    console.log('Premium granted to user:', mockUsers[userIndex]);
    return true;
  }
  return false;
};

// Export function to revoke premium
export const revokePremiumFromUser = (userId: string): boolean => {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex].isPremium = false;
    mockUsers[userIndex].premiumGrant = undefined;
    console.log('Premium revoked from user:', mockUsers[userIndex]);
    return true;
  }
  return false;
};
