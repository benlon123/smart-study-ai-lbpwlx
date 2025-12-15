
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';

interface AccessibleTextProps extends TextProps {
  children: React.ReactNode;
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({ style, children, ...props }) => {
  const { getTextStyle } = useSettings();
  
  const accessibleStyle = getTextStyle(StyleSheet.flatten(style));
  
  return (
    <Text style={accessibleStyle} {...props}>
      {children}
    </Text>
  );
};
