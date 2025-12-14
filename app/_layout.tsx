
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { LessonProvider } from '@/contexts/LessonContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <LessonProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'default',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth/sign-in" />
            <Stack.Screen name="auth/sign-up" />
            <Stack.Screen name="auth/forgot-password" />
            <Stack.Screen name="lesson/[id]" />
            <Stack.Screen name="lesson/create" />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="formsheet"
              options={{
                presentation: 'formSheet',
                sheetAllowedDetents: [0.5, 0.9],
              }}
            />
            <Stack.Screen
              name="transparent-modal"
              options={{
                presentation: 'transparentModal',
                animation: 'fade',
              }}
            />
          </Stack>
        </LessonProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
