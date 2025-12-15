
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface AppSettings {
  accessibility: {
    textSize: 'small' | 'medium' | 'large' | 'extra-large';
    screenReader: boolean;
  };
  theme: {
    mode: 'light' | 'dark' | 'auto';
    customColors: {
      primary: string;
      secondary: string;
      accent: string;
    } | null;
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
    defaultDifficulty: 'Easy' | 'Normal' | 'Hard';
    defaultSubjects: string[];
    sessionLength: number;
    pomodoroEnabled: boolean;
  };
  gamification: {
    showBadges: boolean;
    showPoints: boolean;
    showLeaderboard: boolean;
  };
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleDarkMode: () => void;
  toggleNotifications: (key: keyof AppSettings['notifications']) => void;
  setTextSize: (size: 'small' | 'medium' | 'large' | 'extra-large') => void;
  setDefaultDifficulty: (difficulty: 'Easy' | 'Normal' | 'Hard') => void;
  setDefaultSubjects: (subjects: string[]) => void;
  toggleStudySounds: () => void;
  setCustomColors: (colors: { primary: string; secondary: string; accent: string } | null) => void;
  getTextSizeMultiplier: () => number;
  getTextStyle: (baseStyle: any) => any;
  getColors: () => any;
}

const defaultSettings: AppSettings = {
  accessibility: {
    textSize: 'medium',
    screenReader: false,
  },
  theme: {
    mode: 'light',
    customColors: null,
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
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Color scheme
const normalColors = {
  background: '#F5F5DC',
  text: '#2E294E',
  textSecondary: '#6E798C',
  primary: '#7451EB',
  secondary: '#A892FF',
  accent: '#FF6F61',
  card: '#FFFFFF',
  highlight: '#FFD700',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Sync settings with user data when user changes
  useEffect(() => {
    if (user?.settings) {
      setSettings({
        accessibility: {
          textSize: user.settings.accessibility.textSize,
          screenReader: user.settings.accessibility.screenReader,
        },
        theme: {
          mode: user.settings.theme.mode,
          customColors: user.settings.theme.customColors ? {
            primary: '#7451EB',
            secondary: '#A892FF',
            accent: '#FF6F61',
          } : null,
          eyeStrainReduction: user.settings.theme.eyeStrainReduction,
          studySounds: user.settings.theme.studySounds,
        },
        notifications: user.settings.notifications,
        study: {
          defaultDifficulty: user.settings.study.defaultDifficulty,
          defaultSubjects: user.settings.study.defaultSubjects,
          sessionLength: user.settings.study.sessionLength,
          pomodoroEnabled: user.settings.study.pomodoroEnabled,
        },
        gamification: user.settings.gamification,
      });
    }
  }, [user]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        ...newSettings,
        accessibility: { ...prev.accessibility, ...(newSettings.accessibility || {}) },
        theme: { ...prev.theme, ...(newSettings.theme || {}) },
        notifications: { ...prev.notifications, ...(newSettings.notifications || {}) },
        study: { ...prev.study, ...(newSettings.study || {}) },
        gamification: { ...prev.gamification, ...(newSettings.gamification || {}) },
      };

      // Update user settings in AuthContext
      if (user) {
        updateUser({
          settings: {
            accessibility: {
              ...updated.accessibility,
              dyslexiaFont: false,
              highContrast: false,
              voiceCommands: false,
            },
            theme: {
              ...updated.theme,
              customColors: !!updated.theme.customColors,
            },
            notifications: updated.notifications,
            study: updated.study,
            gamification: updated.gamification,
          },
        });
      }

      console.log('Settings updated:', updated);
      return updated;
    });
  };

  const toggleDarkMode = () => {
    updateSettings({
      theme: {
        ...settings.theme,
        mode: settings.theme.mode === 'dark' ? 'light' : 'dark',
      },
    });
  };

  const toggleNotifications = (key: keyof AppSettings['notifications']) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const setTextSize = (size: 'small' | 'medium' | 'large' | 'extra-large') => {
    console.log('Setting text size to', size);
    updateSettings({
      accessibility: {
        ...settings.accessibility,
        textSize: size,
      },
    });
  };

  const setDefaultDifficulty = (difficulty: 'Easy' | 'Normal' | 'Hard') => {
    updateSettings({
      study: {
        ...settings.study,
        defaultDifficulty: difficulty,
      },
    });
  };

  const setDefaultSubjects = (subjects: string[]) => {
    updateSettings({
      study: {
        ...settings.study,
        defaultSubjects: subjects,
      },
    });
  };

  const toggleStudySounds = () => {
    updateSettings({
      theme: {
        ...settings.theme,
        studySounds: !settings.theme.studySounds,
      },
    });
  };

  const setCustomColors = (colors: { primary: string; secondary: string; accent: string } | null) => {
    updateSettings({
      theme: {
        ...settings.theme,
        customColors: colors,
      },
    });
  };

  const getTextSizeMultiplier = () => {
    switch (settings.accessibility.textSize) {
      case 'small':
        return 0.875;
      case 'medium':
        return 1;
      case 'large':
        return 1.25;
      case 'extra-large':
        return 1.5;
      default:
        return 1;
    }
  };

  const getColors = () => {
    return normalColors;
  };

  const getTextStyle = (baseStyle: any) => {
    const style: any = { ...baseStyle };
    const multiplier = getTextSizeMultiplier();
    
    // Apply text size multiplier
    if (style.fontSize) {
      style.fontSize = Math.round(style.fontSize * multiplier);
    }
    
    return style;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        toggleDarkMode,
        toggleNotifications,
        setTextSize,
        setDefaultDifficulty,
        setDefaultSubjects,
        toggleStudySounds,
        setCustomColors,
        getTextSizeMultiplier,
        getTextStyle,
        getColors,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
