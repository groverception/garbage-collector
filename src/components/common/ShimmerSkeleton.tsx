import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '@/src/constants/colors';
import { normalize } from '@/src/utils/responsive';

interface ShimmerSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Modern shimmer loading skeleton
 * Creates smooth animated placeholder while content loads
 */
export function ShimmerSkeleton({
  width = '100%',
  height = 20,
  borderRadius = normalize(8),
  style,
}: ShimmerSkeletonProps) {
  const shimmerProgress = useSharedValue(0);

  React.useEffect(() => {
    shimmerProgress.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-300, 300],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <View
          style={[
            styles.shimmerGradient,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

/**
 * Pre-built skeleton layouts for common use cases
 */

export function CardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <ShimmerSkeleton width={80} height={80} borderRadius={normalize(12)} />
      <View style={styles.cardContent}>
        <ShimmerSkeleton width="80%" height={20} />
        <ShimmerSkeleton width="60%" height={16} style={{ marginTop: 8 }} />
        <ShimmerSkeleton width="40%" height={14} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

export function ListItemSkeleton() {
  return (
    <View style={styles.listItem}>
      <ShimmerSkeleton width={50} height={50} borderRadius={25} />
      <View style={styles.listContent}>
        <ShimmerSkeleton width="70%" height={18} />
        <ShimmerSkeleton width="50%" height={14} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

export function ImageSkeleton({ aspectRatio = 16 / 9 }: { aspectRatio?: number }) {
  return (
    <View style={[styles.imageSkeleton, { aspectRatio }]}>
      <ShimmerSkeleton width="100%" height="100%" borderRadius={normalize(12)} />
    </View>
  );
}

export function TextBlockSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <View style={styles.textBlock}>
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerSkeleton
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height={16}
          style={{ marginBottom: 8 }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundSecondary,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
  shimmerGradient: {
    width: 300,
    height: '100%',
  },

  // Card skeleton
  cardSkeleton: {
    flexDirection: 'row',
    padding: normalize(16),
    backgroundColor: COLORS.surface,
    borderRadius: normalize(12),
    marginBottom: normalize(12),
  },
  cardContent: {
    flex: 1,
    marginLeft: normalize(16),
    justifyContent: 'center',
  },

  // List item skeleton
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(16),
    backgroundColor: COLORS.surface,
    borderRadius: normalize(12),
    marginBottom: normalize(8),
  },
  listContent: {
    flex: 1,
    marginLeft: normalize(12),
  },

  // Image skeleton
  imageSkeleton: {
    width: '100%',
    marginBottom: normalize(12),
  },

  // Text block skeleton
  textBlock: {
    marginBottom: normalize(16),
  },
});
