import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { OnboardingSlide } from '@/src/components/onboarding/OnboardingSlide';
import { Button } from '@/src/components/common/Button';
import { ONBOARDING_SLIDES } from '@/src/constants/onboarding';
import { COLORS } from '@/src/constants/colors';
import { SPACING } from '@/src/utils/responsive';
import { setOnboardingCompleted } from '@/src/services/database/settings';
import { MorphingBlob } from '@/src/components/common/MorphingBlob';
import { FloatingParticles } from '@/src/components/common/FloatingParticles';
import { LayeredWaves } from '@/src/components/common/AnimatedWave';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;

      // Update current index
      const index = Math.round(event.contentOffset.x / width);
      if (index >= 0 && index < ONBOARDING_SLIDES.length) {
        // Use runOnJS to update React state from worklet
        'worklet';
      }
    },
  });

  // Separate handler for pagination dots (non-animated)
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentIndex && index >= 0 && index < ONBOARDING_SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const handleGetStarted = async () => {
    await setOnboardingCompleted(true);
    router.replace('/(tabs)');
  };

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Background Layers */}
      <View style={styles.backgroundContainer}>
        <MorphingBlob
          size={400}
          colors={[COLORS.primary, COLORS.primaryLight]}
          duration={6000}
          opacity={0.15}
          style={{ top: -100, right: -100 }}
        />
        <MorphingBlob
          size={350}
          colors={[COLORS.accent, COLORS.primaryLight]}
          duration={7000}
          opacity={0.1}
          style={{ bottom: -80, left: -80 }}
        />
        <LayeredWaves height={250} />
        <FloatingParticles count={12} />
      </View>

      <View style={styles.slidesContainer}>
        <AnimatedScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          bounces={false}
        >
          {ONBOARDING_SLIDES.map((slide, index) => (
            <OnboardingSlide
              key={slide.id}
              slide={slide}
              index={index}
              scrollX={scrollX}
            />
          ))}
        </AnimatedScrollView>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {isLastSlide ? (
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              size="large"
              style={styles.button}
            />
          ) : (
            <Button
              title="Next"
              onPress={handleNext}
              size="large"
              style={styles.button}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  slidesContainer: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});
