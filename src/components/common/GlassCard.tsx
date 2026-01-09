import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { COLORS } from '@/src/constants/colors';
import { normalize } from '@/src/utils/responsive';

interface GlassCardProps {
  children: ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  borderRadius?: number;
  style?: ViewStyle;
  pressable?: boolean;
  onPress?: () => void;
}

/**
 * Glassmorphism card component with frosted glass effect
 * Modern, trendy design pattern for 2025-2026
 */
export function GlassCard({
  children,
  intensity = 80,
  tint = 'light',
  borderRadius = normalize(16),
  style,
  pressable = false,
  onPress,
}: GlassCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (pressable) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
      opacity.value = withSpring(0.8, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (pressable) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const content = (
    <Animated.View style={[styles.container, { borderRadius }, animatedStyle, style]}>
      {Platform.OS !== 'web' ? (
        <BlurView intensity={intensity} tint={tint} style={[styles.blur, { borderRadius }]}>
          <View style={[styles.glassEffect, { borderRadius }]}>
            <View style={styles.content}>{children}</View>
          </View>
        </BlurView>
      ) : (
        // Fallback for web
        <View style={[styles.webGlass, { borderRadius }]}>
          <View style={styles.content}>{children}</View>
        </View>
      )}
    </Animated.View>
  );

  if (pressable && onPress) {
    return (
      <Animated.View
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        onTouchCancel={handlePressOut}
        onPress={onPress}
      >
        {content}
      </Animated.View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  blur: {
    overflow: 'hidden',
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  webGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  content: {
    padding: normalize(16),
  },
});
