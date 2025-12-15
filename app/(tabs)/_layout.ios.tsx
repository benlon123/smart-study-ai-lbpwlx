
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useAuth } from '@/contexts/AuthContext';
import { View } from 'react-native';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Return a simple view without tabs when not authenticated
    return <View style={{ flex: 1 }} />;
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="tasks" name="tasks">
        <Icon sf="checklist" />
        <Label>Tasks</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="calendar" name="calendar">
        <Icon sf="calendar" />
        <Label>Calendar</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="analytics" name="analytics">
        <Icon sf="chart.bar.fill" />
        <Label>Analytics</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="settings" name="settings">
        <Icon sf="gearshape.fill" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
