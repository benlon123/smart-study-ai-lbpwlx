
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'tasks',
      route: '/(tabs)/tasks',
      icon: 'task',
      label: 'Tasks',
    },
    {
      name: 'analytics',
      route: '/(tabs)/analytics',
      icon: 'bar-chart',
      label: 'Analytics',
    },
    {
      name: 'info',
      route: '/(tabs)/info',
      icon: 'info',
      label: 'Info',
    },
    {
      name: 'settings',
      route: '/(tabs)/settings',
      icon: 'settings',
      label: 'Settings',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="tasks" name="tasks" />
        <Stack.Screen key="analytics" name="analytics" />
        <Stack.Screen key="info" name="info" />
        <Stack.Screen key="settings" name="settings" />
      </Stack>
      {isAuthenticated && <FloatingTabBar tabs={tabs} />}
    </>
  );
}
