import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated';
import { useContinuousAnimation } from '@/src/hooks/useContinuousAnimation';
import { COLORS } from '@/src/constants/colors';

interface MorphingBlobProps {
  size?: number;
  colors?: string[];
  duration?: number;
  style?: any;
  opacity?: number;
}

/**
 * Animated morphing blob with gradient effect
 * Uses continuous animation to create organic, fluid shapes
 */
export function MorphingBlob({
  size = 300,
  colors = [COLORS.primary, COLORS.primaryLight],
  duration = 4000,
  style,
  opacity = 0.6,
}: MorphingBlobProps) {
  const progress = useContinuousAnimation({ duration, reverse: true });

  // Create multiple animation values for complex morphing
  const scale1 = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [1, 1.2, 1]);
  });

  const scale2 = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [1, 0.8, 1]);
  });

  const rotate = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [0, 360]);
  });

  const borderRadius1 = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [40, 60, 40]);
  });

  const borderRadius2 = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [60, 40, 60]);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleX: scale1.value },
        { scaleY: scale2.value },
        { rotate: `${rotate.value}deg` },
      ],
      borderTopLeftRadius: size * (borderRadius1.value / 100),
      borderTopRightRadius: size * (borderRadius2.value / 100),
      borderBottomLeftRadius: size * (borderRadius2.value / 100),
      borderBottomRightRadius: size * (borderRadius1.value / 100),
    };
  });

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          width: size,
          height: size,
          backgroundColor: colors[0],
          opacity,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
  },
});
