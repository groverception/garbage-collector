import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, normalize, wp, hp } from '../../utils/responsive';
import type { OnboardingSlide as OnboardingSlideType } from '../../constants/onboarding';

interface OnboardingSlideProps {
  slide: OnboardingSlideType;
}

export function OnboardingSlide({ slide }: OnboardingSlideProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.iconContainer}>
        <FontAwesome
          name={slide.icon as any}
          size={normalize(80)}
          color={COLORS.primary}
        />
      </View>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.description}>{slide.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    width: normalize(160),
    height: normalize(160),
    borderRadius: normalize(80),
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
    lineHeight: FONT_SIZES.md * 1.5,
    paddingHorizontal: SPACING.lg,
  },
});
