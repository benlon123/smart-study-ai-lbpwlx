
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/contexts/AuthContext';
import { LessonProvider } from '@/contexts/LessonContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SettingsProvider>
        <LessonProvider>
          <AdminProvider>
            <WidgetProvider>
              <StatusBar style="auto" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: Platform.OS === 'ios' ? 'default' : 'fade',
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth/sign-in" options={{ headerShown: false }} />
                <Stack.Screen name="auth/sign-up" options={{ headerShown: false }} />
                <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
                <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="lesson/create" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: 'modal',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="transparent-modal"
                  options={{
                    presentation: 'transparentModal',
                    animation: 'fade',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="formsheet"
                  options={{
                    presentation: 'formSheet',
                    headerShown: false,
                  }}
                />
              </Stack>
            </WidgetProvider>
          </AdminProvider>
        </LessonProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
