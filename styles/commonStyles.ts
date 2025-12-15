
import { StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';

export const colors = {
  background: '#F5F5DC',        // Beige
  text: '#2E294E',              // Dark Indigo
  textSecondary: '#6E798C',     // Cool Grey
  primary: '#7451EB',           // Vivid Purple
  secondary: '#A892FF',         // Light Purple
  accent: '#FF6F61',            // Salmon
  card: '#FFFFFF',              // White
  highlight: '#FFD700',         // Gold
  border: '#E0E0E0',            // Light grey for borders
  success: '#4CAF50',           // Green for success states
  error: '#F44336',             // Red for error states
  warning: '#FF9800',           // Orange for warnings
};

// High contrast colors
export const highContrastColors = {
  background: '#FFFFFF',        // Pure white
  text: '#000000',              // Pure black
  textSecondary: '#333333',     // Dark grey
  primary: '#0000FF',           // Pure blue
  secondary: '#4B0082',         // Indigo
  accent: '#FF0000',            // Pure red
  card: '#FFFFFF',              // White
  highlight: '#FFD700',         // Gold
  border: '#000000',            // Black borders
  success: '#008000',           // Pure green
  error: '#FF0000',             // Pure red
  warning: '#FFA500',           // Orange
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 8px rgba(116, 81, 235, 0.3)',
      },
      default: {
        shadowColor: '#7451EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accent: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  textWhite: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.secondary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Helper function to get colors based on settings
export const getColors = (highContrast: boolean) => {
  return highContrast ? highContrastColors : colors;
};

// Helper function to get text style with accessibility settings
export const getTextStyle = (
  baseStyle: any,
  dyslexiaFont: boolean,
  textSizeMultiplier: number,
  highContrast: boolean
) => {
  const style: any = { ...baseStyle };
  
  if (dyslexiaFont) {
    style.fontFamily = 'OpenDyslexic';
  }
  
  if (style.fontSize) {
    style.fontSize = style.fontSize * textSizeMultiplier;
  }
  
  if (highContrast && style.color) {
    // Map colors to high contrast equivalents
    if (style.color === colors.text) {
      style.color = highContrastColors.text;
    } else if (style.color === colors.textSecondary) {
      style.color = highContrastColors.textSecondary;
    } else if (style.color === colors.primary) {
      style.color = highContrastColors.primary;
    }
  }
  
  return style;
};
