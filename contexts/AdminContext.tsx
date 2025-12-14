
import React, { createContext, useContext, useState } from 'react';
import { AppNotification, AppSettings } from '@/types/lesson';

interface AdminContextType {
  notifications: AppNotification[];
  appSettings: AppSettings;
  sendNotification: (
    title: string,
    message: string,
    type: AppNotification['type'],
    targetUsers: AppNotification['targetUsers']
  ) => void;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  getNotifications: () => AppNotification[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const defaultAppSettings: AppSettings = {
  aiGenerationLimit: 50,
  defaultTaskCount: 10,
  maintenanceMode: false,
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings);

  const sendNotification = (
    title: string,
    message: string,
    type: AppNotification['type'],
    targetUsers: AppNotification['targetUsers']
  ) => {
    const notification: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      targetUsers,
      createdAt: new Date(),
      createdBy: 'blonergan55@gmail.com',
      read: false,
    };
    
    setNotifications(prev => [notification, ...prev]);
    console.log('Notification sent:', notification);
  };

  const updateAppSettings = (settings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...settings }));
    console.log('App settings updated:', settings);
  };

  const getNotifications = () => {
    return notifications;
  };

  return (
    <AdminContext.Provider
      value={{
        notifications,
        appSettings,
        sendNotification,
        updateAppSettings,
        getNotifications,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
