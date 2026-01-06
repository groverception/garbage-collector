import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { SPACING, normalize } from '../../utils/responsive';

interface OnboardingPaginationProps {
  count: number;
  scrollX: SharedValue<number>;
  width: number;
}

export function OnboardingPagination({
  count,
  scrollX,
  width,
}: OnboardingPaginationProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <PaginationDot
          key={index}
          index={index}
          scrollX={scrollX}
          width={width}
        />
      ))}
    </View>
  );
}

interface PaginationDotProps {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}

function PaginationDot({ index, scrollX, width }: PaginationDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [DOT_SIZE, DOT_SIZE * 3, DOT_SIZE],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    return {
      width: dotWidth,
      opacity,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const DOT_SIZE = normalize(8);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: COLORS.primary,
  },
});
