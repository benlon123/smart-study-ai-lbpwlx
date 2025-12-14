
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppSettings {
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
  toggleDyslexiaFont: () => void;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
  toggleNotifications: (key: keyof AppSettings['notifications']) => void;
}

const defaultSettings: AppSettings = {
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
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    // Load settings from storage
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In a real app, load from AsyncStorage or SecureStore
      console.log('Settings loaded');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      // In a real app, save to AsyncStorage or SecureStore
      console.log('Settings saved:', newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

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
      saveSettings(updated);
      return updated;
    });
  };

  const toggleDyslexiaFont = () => {
    setSettings(prev => {
      const updated = {
        ...prev,
        accessibility: {
          ...prev.accessibility,
          dyslexiaFont: !prev.accessibility.dyslexiaFont,
        },
      };
      saveSettings(updated);
      console.log('Dyslexia font toggled:', updated.accessibility.dyslexiaFont);
      return updated;
    });
  };

  const toggleDarkMode = () => {
    setSettings(prev => {
      const updated = {
        ...prev,
        theme: {
          ...prev.theme,
          mode: prev.theme.mode === 'dark' ? 'light' : 'dark',
        },
      };
      saveSettings(updated);
      console.log('Dark mode toggled:', updated.theme.mode);
      return updated;
    });
  };

  const toggleHighContrast = () => {
    setSettings(prev => {
      const updated = {
        ...prev,
        accessibility: {
          ...prev.accessibility,
          highContrast: !prev.accessibility.highContrast,
        },
      };
      saveSettings(updated);
      console.log('High contrast toggled:', updated.accessibility.highContrast);
      return updated;
    });
  };

  const toggleNotifications = (key: keyof AppSettings['notifications']) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: !prev.notifications[key],
        },
      };
      saveSettings(updated);
      console.log(`Notification ${key} toggled:`, updated.notifications[key]);
      return updated;
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        toggleDyslexiaFont,
        toggleDarkMode,
        toggleHighContrast,
        toggleNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
