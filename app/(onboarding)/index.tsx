import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { OnboardingSlide } from '@/src/components/onboarding/OnboardingSlide';
import { OnboardingPagination } from '@/src/components/onboarding/OnboardingPagination';
import { Button } from '@/src/components/common/Button';
import { ONBOARDING_SLIDES } from '@/src/constants/onboarding';
import { COLORS } from '@/src/constants/colors';
import { SPACING } from '@/src/utils/responsive';
import { setOnboardingCompleted } from '@/src/services/database/settings';

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<typeof ONBOARDING_SLIDES[0]>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleGetStarted = async () => {
    await setOnboardingCompleted(true);
    router.replace('/(tabs)');
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems[0]?.index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slidesContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OnboardingSlide slide={item} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />
      </View>

      <View style={styles.footer}>
        <OnboardingPagination
          count={ONBOARDING_SLIDES.length}
          scrollX={scrollX}
          width={width}
        />

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
  slidesContainer: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.xl,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});
