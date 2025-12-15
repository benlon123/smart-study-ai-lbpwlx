
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { settings, updateSettings, getTextSizeMultiplier } = useSettings();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            signOut();
            router.replace('/auth/sign-in');
          },
        },
      ]
    );
  };

  const containerStyle = settings.theme.mode === 'dark'
    ? [commonStyles.container, styles.darkContainer]
    : commonStyles.container;

  const textColor = settings.theme.mode === 'dark' ? '#FFFFFF' : colors.text;
  const cardBg = settings.theme.mode === 'dark' ? '#1a1a1a' : colors.card;
  const textMultiplier = getTextSizeMultiplier();

  return (
    <View style={containerStyle}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[
            commonStyles.title,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 28 * textMultiplier }
          ]}>
            Settings
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 18 * textMultiplier }
          ]}>
            Appearance
          </Text>

          <View style={[styles.settingCard, { backgroundColor: cardBg }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <IconSymbol
                  ios_icon_name="moon.fill"
                  android_material_icon_name="dark-mode"
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.settingText}>
                  <Text style={[
                    styles.settingTitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { color: textColor, fontSize: 15 * textMultiplier }
                  ]}>
                    Dark Mode
                  </Text>
                  <Text style={[
                    styles.settingSubtitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { fontSize: 13 * textMultiplier }
                  ]}>
                    Reduce eye strain in low light
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.theme.mode === 'dark'}
                onValueChange={(value) =>
                  updateSettings({
                    theme: { ...settings.theme, mode: value ? 'dark' : 'light' },
                  })
                }
                trackColor={{ false: colors.textSecondary, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 18 * textMultiplier }
          ]}>
            Accessibility
          </Text>

          <View style={[styles.settingCard, { backgroundColor: cardBg }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <IconSymbol
                  ios_icon_name="textformat.size"
                  android_material_icon_name="format-size"
                  size={24}
                  color={colors.secondary}
                />
                <View style={styles.settingText}>
                  <Text style={[
                    styles.settingTitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { color: textColor, fontSize: 15 * textMultiplier }
                  ]}>
                    Text Size
                  </Text>
                  <Text style={[
                    styles.settingSubtitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { fontSize: 13 * textMultiplier }
                  ]}>
                    {settings.accessibility.textSize === 'small' ? 'Small' :
                     settings.accessibility.textSize === 'medium' ? 'Medium' :
                     settings.accessibility.textSize === 'large' ? 'Large' : 'Extra Large'}
                  </Text>
                </View>
              </View>
              <View style={styles.textSizeButtons}>
                {['small', 'medium', 'large', 'xlarge'].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.textSizeButton,
                      settings.accessibility.textSize === size && styles.textSizeButtonActive,
                      { backgroundColor: settings.accessibility.textSize === size ? colors.primary : cardBg }
                    ]}
                    onPress={() =>
                      updateSettings({
                        accessibility: { ...settings.accessibility, textSize: size as any },
                      })
                    }
                  >
                    <Text style={[
                      styles.textSizeButtonText,
                      { color: settings.accessibility.textSize === size ? '#FFFFFF' : textColor }
                    ]}>
                      {size === 'small' ? 'S' : size === 'medium' ? 'M' : size === 'large' ? 'L' : 'XL'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <IconSymbol
                  ios_icon_name="eye.fill"
                  android_material_icon_name="visibility"
                  size={24}
                  color={colors.accent}
                />
                <View style={styles.settingText}>
                  <Text style={[
                    styles.settingTitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { color: textColor, fontSize: 15 * textMultiplier }
                  ]}>
                    Dyslexia-Friendly Font
                  </Text>
                  <Text style={[
                    styles.settingSubtitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { fontSize: 13 * textMultiplier }
                  ]}>
                    Easier to read for dyslexic users
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.accessibility.dyslexiaFont}
                onValueChange={(value) =>
                  updateSettings({
                    accessibility: { ...settings.accessibility, dyslexiaFont: value },
                  })
                }
                trackColor={{ false: colors.textSecondary, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <IconSymbol
                  ios_icon_name="circle.lefthalf.filled"
                  android_material_icon_name="contrast"
                  size={24}
                  color={colors.highlight}
                />
                <View style={styles.settingText}>
                  <Text style={[
                    styles.settingTitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { color: textColor, fontSize: 15 * textMultiplier }
                  ]}>
                    High Contrast
                  </Text>
                  <Text style={[
                    styles.settingSubtitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { fontSize: 13 * textMultiplier }
                  ]}>
                    Improve text visibility
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.accessibility.highContrast}
                onValueChange={(value) =>
                  updateSettings({
                    accessibility: { ...settings.accessibility, highContrast: value },
                  })
                }
                trackColor={{ false: colors.textSecondary, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 18 * textMultiplier }
          ]}>
            Study Preferences
          </Text>

          <View style={[styles.settingCard, { backgroundColor: cardBg }]}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => {
                console.log('Default subject selection');
              }}
            >
              <View style={styles.settingInfo}>
                <IconSymbol
                  ios_icon_name="book.fill"
                  android_material_icon_name="menu-book"
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.settingText}>
                  <Text style={[
                    styles.settingTitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { color: textColor, fontSize: 15 * textMultiplier }
                  ]}>
                    Default Subject
                  </Text>
                  <Text style={[
                    styles.settingSubtitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { fontSize: 13 * textMultiplier }
                  ]}>
                    {settings.studyPreferences.defaultSubject || 'Not set'}
                  </Text>
                </View>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <IconSymbol
                  ios_icon_name="gauge.medium"
                  android_material_icon_name="speed"
                  size={24}
                  color={colors.secondary}
                />
                <View style={styles.settingText}>
                  <Text style={[
                    styles.settingTitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { color: textColor, fontSize: 15 * textMultiplier }
                  ]}>
                    Default Difficulty
                  </Text>
                  <Text style={[
                    styles.settingSubtitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { fontSize: 13 * textMultiplier }
                  ]}>
                    {settings.studyPreferences.defaultDifficulty || 'Medium'}
                  </Text>
                </View>
              </View>
              <View style={styles.difficultyButtons}>
                {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.difficultyButton,
                      settings.studyPreferences.defaultDifficulty === difficulty && styles.difficultyButtonActive,
                      { backgroundColor: settings.studyPreferences.defaultDifficulty === difficulty ? colors.primary : cardBg }
                    ]}
                    onPress={() =>
                      updateSettings({
                        studyPreferences: { ...settings.studyPreferences, defaultDifficulty: difficulty },
                      })
                    }
                  >
                    <Text style={[
                      styles.difficultyButtonText,
                      { color: settings.studyPreferences.defaultDifficulty === difficulty ? '#FFFFFF' : textColor }
                    ]}>
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 18 * textMultiplier }
          ]}>
            Account
          </Text>

          <View style={[styles.settingCard, { backgroundColor: cardBg }]}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => {
                Alert.alert('Coming Soon', 'This feature will be available in a future update.');
              }}
            >
              <View style={styles.settingInfo}>
                <IconSymbol
                  ios_icon_name="envelope.fill"
                  android_material_icon_name="email"
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.settingText}>
                  <Text style={[
                    styles.settingTitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { color: textColor, fontSize: 15 * textMultiplier }
                  ]}>
                    Update Email
                  </Text>
                  <Text style={[
                    styles.settingSubtitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { fontSize: 13 * textMultiplier }
                  ]}>
                    {user?.email}
                  </Text>
                </View>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBorder]}
              onPress={() => {
                Alert.alert('Coming Soon', 'This feature will be available in a future update.');
              }}
            >
              <View style={styles.settingInfo}>
                <IconSymbol
                  ios_icon_name="lock.fill"
                  android_material_icon_name="lock"
                  size={24}
                  color={colors.secondary}
                />
                <View style={styles.settingText}>
                  <Text style={[
                    styles.settingTitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { color: textColor, fontSize: 15 * textMultiplier }
                  ]}>
                    Change Password
                  </Text>
                  <Text style={[
                    styles.settingSubtitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { fontSize: 13 * textMultiplier }
                  ]}>
                    Update your password
                  </Text>
                </View>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRow, styles.settingRowBorder]}
              onPress={handleSignOut}
            >
              <View style={styles.settingInfo}>
                <IconSymbol
                  ios_icon_name="arrow.right.square.fill"
                  android_material_icon_name="logout"
                  size={24}
                  color="#EF4444"
                />
                <View style={styles.settingText}>
                  <Text style={[
                    styles.settingTitle,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { color: '#EF4444', fontSize: 15 * textMultiplier }
                  ]}>
                    Sign Out
                  </Text>
                </View>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[
            styles.footerText,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { fontSize: 12 * textMultiplier }
          ]}>
            SmartStudy AI v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 0,
    paddingBottom: 120,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary + '20',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  textSizeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  textSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  textSizeButtonActive: {
    backgroundColor: colors.primary,
  },
  textSizeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  difficultyButtonActive: {
    backgroundColor: colors.primary,
  },
  difficultyButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dyslexiaFont: {
    fontFamily: 'OpenDyslexic',
  },
});
