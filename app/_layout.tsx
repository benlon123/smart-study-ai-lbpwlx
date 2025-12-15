
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { AuthProvider } from '@/contexts/AuthContext';
import { LessonProvider } from '@/contexts/LessonContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AdminProvider } from '@/contexts/AdminContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AdminProvider>
        <LessonProvider>
          <SettingsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="lesson" />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen name="formsheet" options={{ presentation: 'formSheet' }} />
              <Stack.Screen name="transparent-modal" options={{ presentation: 'transparentModal' }} />
            </Stack>
          </SettingsProvider>
        </LessonProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
