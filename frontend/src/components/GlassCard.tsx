import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { BrandColors } from '@/constants/Colors';

type GlassCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
};

export default function GlassCard({ children, style, intensity = 60 }: GlassCardProps) {
  // If we are on web, BlurView isn't supported the same way — use a CSS backdrop-filter fallback
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return <View style={[styles.glassWeb, style]}>{children}</View>;
  }

  return (
    <BlurView intensity={intensity} tint="light" style={[styles.container, style]}>
      <View style={styles.innerContent}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BrandColors.glassBorder,
    overflow: 'hidden',
    backgroundColor: BrandColors.glassBg,
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  innerContent: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  glassWeb: {
    backgroundColor: BrandColors.glassBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BrandColors.glassBorder,
    padding: 20,
    overflow: 'hidden',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0px 4px 12px rgba(10, 35, 66, 0.05)',
  } as any,
});