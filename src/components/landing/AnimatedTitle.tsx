import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { TITLE_TRANSLATIONS, ANIMATION_CONFIG } from '../../constants/translations';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES, SPACING, normalize } from '../../utils/responsive';

export function AnimatedTitle() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const nextTitle = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TITLE_TRANSLATIONS.length);
  }, []);

  useEffect(() => {
    const animate = () => {
      opacity.value = withSequence(
        withTiming(0, {
          duration: ANIMATION_CONFIG.fadeDuration,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(1, {
          duration: ANIMATION_CONFIG.fadeDuration,
          easing: Easing.in(Easing.ease),
        })
      );

      scale.value = withSequence(
        withTiming(0.95, {
          duration: ANIMATION_CONFIG.fadeDuration,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(1, {
          duration: ANIMATION_CONFIG.fadeDuration,
          easing: Easing.in(Easing.ease),
        })
      );

      setTimeout(() => {
        runOnJS(nextTitle)();
      }, ANIMATION_CONFIG.fadeDuration);
    };

    const interval = setInterval(animate, ANIMATION_CONFIG.displayDuration + ANIMATION_CONFIG.fadeDuration * 2);

    return () => clearInterval(interval);
  }, [opacity, scale, nextTitle]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const currentTranslation = TITLE_TRANSLATIONS[currentIndex];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.titleContainer, animatedStyle]}>
        <Text style={styles.title}>{currentTranslation.text}</Text>
        <Text style={styles.language}>{currentTranslation.language}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: normalize(120),
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  language: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
});
