import React, { ReactNode } from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/src/constants/colors';
import { normalize, SPACING, FONT_SIZES } from '@/src/utils/responsive';

interface RippleButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
  rippleColor?: string;
}

/**
 * Modern button with Material Design 3 ripple effect
 * Includes haptic feedback and smooth animations
 */
export function RippleButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  haptic = true,
  rippleColor,
}: RippleButtonProps) {
  const scale = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const triggerHaptic = () => {
    if (haptic && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      // Trigger ripple effect
      rippleScale.value = 0;
      rippleOpacity.value = 1;

      rippleScale.value = withTiming(2, { duration: 600 });
      rippleOpacity.value = withSequence(
        withTiming(0.3, { duration: 0 }),
        withTiming(0, { duration: 600 })
      );

      // Button press animation
      scale.value = withSequence(
        withSpring(0.95, { damping: 15, stiffness: 400 }),
        withSpring(1, { damping: 15, stiffness: 400 })
      );

      triggerHaptic();
      onPress();
    }
  };

  const tap = Gesture.Tap()
    .onBegin(() => {
      if (!disabled && !loading) {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
      }
    })
    .onFinalize(() => {
      if (!disabled && !loading) {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        runOnJS(handlePress)();
      }
    });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedRippleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rippleScale.value }],
      opacity: rippleOpacity.value,
    };
  });

  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[animatedButtonStyle, styles.container]}>
        <Animated.View style={buttonStyles}>
          {/* Ripple effect overlay */}
          <Animated.View
            style={[
              styles.ripple,
              {
                backgroundColor: rippleColor || COLORS.primaryLight,
              },
              animatedRippleStyle,
            ]}
          />

          {/* Button content */}
          {icon && <Animated.View style={styles.icon}>{icon}</Animated.View>}
          {title && <Text style={textStyles}>{title}</Text>}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(12),
    overflow: 'hidden',
    position: 'relative',
  },

  // Variants
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },

  // Sizes
  smallButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 36,
  },
  mediumButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 44,
  },
  largeButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    minHeight: 52,
  },

  // Disabled state
  disabledButton: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.textLight,
  },
  secondaryText: {
    color: COLORS.textLight,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },
  smallText: {
    fontSize: FONT_SIZES.sm,
  },
  mediumText: {
    fontSize: FONT_SIZES.md,
  },
  largeText: {
    fontSize: FONT_SIZES.lg,
  },
  disabledText: {
    opacity: 0.7,
  },

  // Ripple effect
  ripple: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: normalize(12),
  },

  icon: {
    marginRight: SPACING.sm,
  },
});
