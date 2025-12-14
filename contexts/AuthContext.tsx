
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as AppleAuthentication from 'expo-apple-authentication';
import { User, PremiumGrant } from '@/types/lesson';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  biometricAvailable: boolean;
  biometricEnabled: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signInWithBiometric: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  updateStreak: () => void;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
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
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    checkSession();
    checkBiometricAvailability();
  }, []);

  // Update streak when user logs in
  useEffect(() => {
    if (user) {
      updateStreak();
    }
  }, [user?.id]);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
      
      // Check if biometric is enabled for this user
      const biometricEnabledStr = await SecureStore.getItemAsync('biometric_enabled');
      setBiometricEnabled(biometricEnabledStr === 'true');
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const checkSession = async () => {
    try {
      // Check for saved credentials
      const savedEmail = await SecureStore.getItemAsync('saved_email');
      const savedPassword = await SecureStore.getItemAsync('saved_password');
      
      if (savedEmail && savedPassword) {
        // Auto sign in with saved credentials
        await signIn(savedEmail, savedPassword, false);
      }
      
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
      
      // Save credentials securely
      await SecureStore.setItemAsync('saved_email', email);
      await SecureStore.setItemAsync('saved_password', password);
      
      console.log('User signed up:', newUser);
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error('Failed to sign up. Please try again.');
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
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
      
      // Save credentials if remember me is enabled
      if (rememberMe) {
        await SecureStore.setItemAsync('saved_email', email);
        await SecureStore.setItemAsync('saved_password', password);
      }
      
      console.log('User signed in:', existingUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error('Failed to sign in. Please check your credentials.');
    }
  };

  const signInWithBiometric = async () => {
    try {
      if (!biometricAvailable) {
        throw new Error('Biometric authentication is not available on this device');
      }

      if (!biometricEnabled) {
        throw new Error('Biometric authentication is not enabled. Please enable it in settings.');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Sign in to SmartStudy AI',
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        // Get saved credentials
        const savedEmail = await SecureStore.getItemAsync('saved_email');
        const savedPassword = await SecureStore.getItemAsync('saved_password');
        
        if (savedEmail && savedPassword) {
          await signIn(savedEmail, savedPassword, false);
        } else {
          throw new Error('No saved credentials found');
        }
      } else {
        throw new Error('Biometric authentication failed');
      }
    } catch (error) {
      console.error('Biometric sign in error:', error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Sign-In is only available on iOS');
      }

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Apple Sign-In is not available on this device');
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Create or find user with Apple ID
      const email = credential.email || `${credential.user}@appleid.com`;
      const name = credential.fullName 
        ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
        : 'Apple User';

      let existingUser = mockUsers.find(u => u.email === email);
      
      if (!existingUser) {
        existingUser = {
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
        mockUsers.push(existingUser);
      }
      
      setUser(existingUser);
      
      // Save Apple ID credential
      await SecureStore.setItemAsync('apple_user_id', credential.user);
      
      console.log('User signed in with Apple:', existingUser);
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        console.log('Apple Sign-In was canceled');
      } else {
        console.error('Apple Sign-In error:', error);
        throw new Error('Failed to sign in with Apple. Please try again.');
      }
    }
  };

  const enableBiometric = async () => {
    try {
      if (!biometricAvailable) {
        Alert.alert(
          'Biometric Not Available',
          'Biometric authentication is not available on this device or no biometric data is enrolled.'
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication',
        fallbackLabel: 'Cancel',
      });

      if (result.success) {
        await SecureStore.setItemAsync('biometric_enabled', 'true');
        setBiometricEnabled(true);
        Alert.alert('Success', 'Biometric authentication has been enabled');
      }
    } catch (error) {
      console.error('Error enabling biometric:', error);
      Alert.alert('Error', 'Failed to enable biometric authentication');
    }
  };

  const disableBiometric = async () => {
    try {
      await SecureStore.deleteItemAsync('biometric_enabled');
      setBiometricEnabled(false);
      Alert.alert('Success', 'Biometric authentication has been disabled');
    } catch (error) {
      console.error('Error disabling biometric:', error);
      Alert.alert('Error', 'Failed to disable biometric authentication');
    }
  };

  const signOut = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      
      // Clear saved credentials if biometric is not enabled
      if (!biometricEnabled) {
        await SecureStore.deleteItemAsync('saved_email');
        await SecureStore.deleteItemAsync('saved_password');
      }
      
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
        biometricAvailable,
        biometricEnabled,
        signUp,
        signIn,
        signInWithBiometric,
        signInWithApple,
        signOut,
        forgotPassword,
        updateUser,
        updateStreak,
        enableBiometric,
        disableBiometric,
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
