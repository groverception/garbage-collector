import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants/colors';
import { normalize } from '@/src/utils/responsive';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  enabled?: boolean;
}

const PULL_THRESHOLD = 80;
const MAX_PULL = 120;

/**
 * Custom pull-to-refresh with organic animation
 * Features elastic physics and loading indicator
 */
export function PullToRefresh({
  children,
  onRefresh,
  enabled = true,
}: PullToRefreshProps) {
  const translateY = useSharedValue(0);
  const isRefreshing = useSharedValue(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);

  const triggerRefresh = async () => {
    isRefreshing.value = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Start loading animation
    rotation.value = withTiming(360, { duration: 1000 });

    try {
      await onRefresh();
    } finally {
      isRefreshing.value = false;
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      rotation.value = 0;
      scale.value = withTiming(0, { duration: 200 });
    }
  };

  const pan = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetY(10)
    .onUpdate((event) => {
      if (!isRefreshing.value && event.translationY > 0) {
        // Elastic resistance effect
        const resistance = 0.5;
        const newValue = Math.min(event.translationY * resistance, MAX_PULL);
        translateY.value = newValue;

        // Update icon rotation and scale
        rotation.value = interpolate(
          newValue,
          [0, PULL_THRESHOLD],
          [0, 180],
          Extrapolate.CLAMP
        );

        scale.value = interpolate(
          newValue,
          [0, PULL_THRESHOLD],
          [0, 1],
          Extrapolate.CLAMP
        );
      }
    })
    .onEnd((event) => {
      if (!isRefreshing.value) {
        if (translateY.value >= PULL_THRESHOLD) {
          // Trigger refresh
          translateY.value = withSpring(PULL_THRESHOLD, {
            damping: 15,
            stiffness: 150,
          });
          runOnJS(triggerRefresh)();
        } else {
          // Snap back
          translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
          rotation.value = withTiming(0, { duration: 200 });
          scale.value = withTiming(0, { duration: 200 });
        }
      }
    });

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const indicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, PULL_THRESHOLD / 2, PULL_THRESHOLD],
      [0, 0.5, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.content, contentStyle]}>
          {/* Pull indicator */}
          <Animated.View style={[styles.indicator, indicatorStyle]}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={isRefreshing.value ? "loading" : "refresh"}
                size={24}
                color={COLORS.primary}
              />
            </View>
          </Animated.View>

          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    zIndex: 999,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
