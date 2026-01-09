import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, MAX_CONTENT_WIDTH } from '../../utils/responsive';
import type { OnboardingSlide as OnboardingSlideType } from '../../constants/onboarding';
import { PARALLAX_FACTORS } from '@/src/constants/animations';

interface OnboardingSlideProps {
  slide: OnboardingSlideType;
  index: number;
  scrollX: Animated.SharedValue<number>;
}

export function OnboardingSlide({ slide, index, scrollX }: OnboardingSlideProps) {
  const { width } = useWindowDimensions();
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  // Parallax effect for icon container - moves slower
  const iconAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [width * PARALLAX_FACTORS.background, 0, -width * PARALLAX_FACTORS.background],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );

    const rotate = interpolate(
      scrollX.value,
      inputRange,
      [15, 0, -15],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX },
        { scale },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  // Parallax effect for text - moves at normal speed
  const textAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [width * PARALLAX_FACTORS.midground, 0, -width * PARALLAX_FACTORS.midground],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  // Entrance animation for the slide
  const slideAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.container, { width }, slideAnimatedStyle]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <FontAwesome
            name={slide.icon as any}
            size={60}
            color={COLORS.primary}
          />
        </Animated.View>
        <Animated.View style={textAnimatedStyle}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  content: {
    maxWidth: MAX_CONTENT_WIDTH,
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
});
