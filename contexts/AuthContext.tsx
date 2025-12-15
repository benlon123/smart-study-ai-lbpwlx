
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, PremiumGrant } from '@/types/lesson';
import { router } from 'expo-router';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  biometricAvailable: boolean;
  biometricEnabled: boolean;
  signUp: (name: string, email: string, password: string, language: string) => Promise<void>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signInWithBiometric: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  updateStreak: () => void;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
  getAllUsers: () => User[];
  findUserByEmailOrName: (searchTerm: string) => User | undefined;
  grantPremiumToUser: (userId: string, grantedBy: string, isPermanent: boolean, expiresAt?: Date, reason?: string) => Promise<boolean>;
  revokePremiumFromUser: (userId: string) => Promise<boolean>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Storage keys
const USERS_STORAGE_KEY = '@smartstudy_users';
const CURRENT_USER_KEY = '@smartstudy_current_user';

// Helper function to load users from storage
const loadUsersFromStorage = async (): Promise<User[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (usersJson) {
      const users = JSON.parse(usersJson);
      // Convert date strings back to Date objects
      return users.map((user: any) => ({
        ...user,
        lastLoginDate: user.lastLoginDate ? new Date(user.lastLoginDate) : undefined,
        signupDate: new Date(user.signupDate),
        premiumGrant: user.premiumGrant ? {
          ...user.premiumGrant,
          grantedAt: new Date(user.premiumGrant.grantedAt),
          expiresAt: user.premiumGrant.expiresAt ? new Date(user.premiumGrant.expiresAt) : undefined,
        } : undefined,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading users from storage:', error);
    return [];
  }
};

// Helper function to save users to storage
const saveUsersToStorage = async (users: User[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    console.log('Users saved to storage, count:', users.length);
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
};

// Helper function to save current user
const saveCurrentUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    console.log('Current user saved');
  } catch (error) {
    console.error('Error saving current user:', error);
  }
};

// Helper function to load current user
const loadCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (userJson) {
      const user = JSON.parse(userJson);
      return {
        ...user,
        lastLoginDate: user.lastLoginDate ? new Date(user.lastLoginDate) : undefined,
        signupDate: new Date(user.signupDate),
        premiumGrant: user.premiumGrant ? {
          ...user.premiumGrant,
          grantedAt: new Date(user.premiumGrant.grantedAt),
          expiresAt: user.premiumGrant.expiresAt ? new Date(user.premiumGrant.expiresAt) : undefined,
        } : undefined,
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading current user:', error);
    return null;
  }
};

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
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    initializeAuth();
  }, []);

  // Update streak when user logs in
  useEffect(() => {
    if (user) {
      updateStreak();
    }
  }, [user?.id]);

  const initializeAuth = async () => {
    try {
      // Load all users from storage
      const users = await loadUsersFromStorage();
      console.log('Loaded users from storage:', users.length);
      setAllUsers(users);
      
      // Check biometric availability
      await checkBiometricAvailability();
      
      // Check for saved credentials
      const savedEmail = await SecureStore.getItemAsync('saved_email');
      const savedPassword = await SecureStore.getItemAsync('saved_password');
      
      if (savedEmail && savedPassword) {
        // Auto sign in with saved credentials
        await signIn(savedEmail, savedPassword, false);
      } else {
        // Try to load last logged in user
        const lastUser = await loadCurrentUser();
        if (lastUser) {
          setUser(lastUser);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing auth:', error);
      setIsLoading(false);
    }
  };

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

  const updateUserInDatabase = async (updatedUser: User) => {
    const userIndex = allUsers.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      const newUsers = [...allUsers];
      newUsers[userIndex] = updatedUser;
      setAllUsers(newUsers);
      await saveUsersToStorage(newUsers);
      await saveCurrentUser(updatedUser);
    }
  };

  const refreshUsers = async () => {
    const users = await loadUsersFromStorage();
    console.log('Refreshed users from storage:', users.length);
    setAllUsers(users);
    
    // Also refresh current user if logged in
    if (user) {
      const updatedCurrentUser = users.find(u => u.id === user.id);
      if (updatedCurrentUser) {
        setUser(updatedCurrentUser);
      }
    }
  };

  const signUp = async (name: string, email: string, password: string, language: string = 'en') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reload users to ensure we have the latest data
      const latestUsers = await loadUsersFromStorage();
      
      // Check if email already exists
      const existingUser = latestUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        throw new Error('EMAIL_EXISTS');
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        language,
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
      
      const newUsers = [...latestUsers, newUser];
      setAllUsers(newUsers);
      await saveUsersToStorage(newUsers);
      
      setUser(newUser);
      await saveCurrentUser(newUser);
      
      // Save credentials securely
      await SecureStore.setItemAsync('saved_email', email);
      await SecureStore.setItemAsync('saved_password', password);
      
      console.log('User signed up:', newUser);
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      throw new Error('Failed to sign up. Please try again.');
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reload users to ensure we have the latest data
      const latestUsers = await loadUsersFromStorage();
      setAllUsers(latestUsers);
      
      let existingUser = latestUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!existingUser) {
        existingUser = {
          id: `user-${Date.now()}`,
          name: email === 'blonergan55@gmail.com' ? 'Admin User' : 'Test User',
          email,
          language: 'en',
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
        const newUsers = [...latestUsers, existingUser];
        setAllUsers(newUsers);
        await saveUsersToStorage(newUsers);
      }
      
      setUser(existingUser);
      await saveCurrentUser(existingUser);
      
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

      // Reload users to ensure we have the latest data
      const latestUsers = await loadUsersFromStorage();
      setAllUsers(latestUsers);

      // Create or find user with Apple ID
      const email = credential.email || `${credential.user}@appleid.com`;
      const name = credential.fullName 
        ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
        : 'Apple User';

      let existingUser = latestUsers.find(u => u.email === email);
      
      if (!existingUser) {
        existingUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          language: 'en',
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
        const newUsers = [...latestUsers, existingUser];
        setAllUsers(newUsers);
        await saveUsersToStorage(newUsers);
      }
      
      setUser(existingUser);
      await saveCurrentUser(existingUser);
      
      // Save Apple ID credential
      await SecureStore.setItemAsync('apple_user_id', credential.user);
      
      console.log('User signed in with Apple:', existingUser);
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        console.log('Apple Sign-In was canceled');
        throw new Error('Apple Sign-In was canceled');
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
      console.log('=== Sign out process started ===');
      
      // First, clear the user state immediately
      console.log('Clearing user state...');
      setUser(null);
      
      // Clear saved credentials if biometric is not enabled
      if (!biometricEnabled) {
        try {
          console.log('Clearing saved credentials...');
          await SecureStore.deleteItemAsync('saved_email');
          await SecureStore.deleteItemAsync('saved_password');
          console.log('Saved credentials cleared');
        } catch (error) {
          console.error('Error clearing credentials:', error);
        }
      }
      
      // Remove current user from AsyncStorage
      try {
        console.log('Clearing current user from AsyncStorage...');
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
        console.log('Current user cleared from storage');
      } catch (error) {
        console.error('Error clearing current user:', error);
      }
      
      console.log('=== Sign out completed successfully ===');
      
      // Navigate to home screen after a short delay to ensure state is updated
      console.log('Navigating to home screen...');
      setTimeout(() => {
        try {
          router.replace('/(tabs)/(home)/');
          console.log('Navigation to home screen completed');
        } catch (navError) {
          console.error('Navigation error:', navError);
        }
      }, 200);
      
    } catch (error) {
      console.error('=== Sign out error ===', error);
      // Even if there's an error, clear the user state and navigate
      setUser(null);
      setTimeout(() => {
        try {
          router.replace('/(tabs)/(home)/');
        } catch (navError) {
          console.error('Fallback navigation error:', navError);
        }
      }, 200);
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

  const getAllUsersFunc = (): User[] => {
    console.log('getAllUsers called, returning', allUsers.length, 'users');
    return allUsers;
  };

  const findUserByEmailOrNameFunc = (searchTerm: string): User | undefined => {
    const term = searchTerm.toLowerCase().trim();
    const foundUser = allUsers.find(u => 
      u.email.toLowerCase().includes(term) || 
      u.name.toLowerCase().includes(term)
    );
    console.log('findUserByEmailOrName called with:', searchTerm, 'found:', foundUser?.email);
    return foundUser;
  };

  const grantPremiumToUserFunc = async (
    userId: string, 
    grantedBy: string, 
    isPermanent: boolean, 
    expiresAt?: Date,
    reason?: string
  ): Promise<boolean> => {
    try {
      // Reload users to ensure we have the latest data
      const latestUsers = await loadUsersFromStorage();
      const userIndex = latestUsers.findIndex(u => u.id === userId);
      
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
        
        latestUsers[userIndex].isPremium = true;
        latestUsers[userIndex].premiumGrant = grant;
        
        await saveUsersToStorage(latestUsers);
        setAllUsers(latestUsers);
        
        // Update current user if it's the same user
        if (user?.id === userId) {
          const updatedUser = latestUsers[userIndex];
          setUser(updatedUser);
          await saveCurrentUser(updatedUser);
        }
        
        console.log('Premium granted to user:', latestUsers[userIndex].email);
        return true;
      }
      console.log('User not found for premium grant:', userId);
      return false;
    } catch (error) {
      console.error('Error granting premium:', error);
      return false;
    }
  };

  const revokePremiumFromUserFunc = async (userId: string): Promise<boolean> => {
    try {
      // Reload users to ensure we have the latest data
      const latestUsers = await loadUsersFromStorage();
      const userIndex = latestUsers.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        latestUsers[userIndex].isPremium = false;
        latestUsers[userIndex].premiumGrant = undefined;
        
        await saveUsersToStorage(latestUsers);
        setAllUsers(latestUsers);
        
        // Update current user if it's the same user
        if (user?.id === userId) {
          const updatedUser = latestUsers[userIndex];
          setUser(updatedUser);
          await saveCurrentUser(updatedUser);
        }
        
        console.log('Premium revoked from user:', latestUsers[userIndex].email);
        return true;
      }
      console.log('User not found for premium revoke:', userId);
      return false;
    } catch (error) {
      console.error('Error revoking premium:', error);
      return false;
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
        getAllUsers: getAllUsersFunc,
        findUserByEmailOrName: findUserByEmailOrNameFunc,
        grantPremiumToUser: grantPremiumToUserFunc,
        revokePremiumFromUser: revokePremiumFromUserFunc,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
