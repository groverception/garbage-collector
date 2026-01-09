import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useContinuousAnimation } from '@/src/hooks/useContinuousAnimation';
import { COLORS } from '@/src/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedWaveProps {
  height?: number;
  color?: string;
  opacity?: number;
  speed?: number;
  inverted?: boolean;
}

/**
 * Animated wave component using SVG paths
 * Creates smooth, flowing wave animations
 */
export function AnimatedWave({
  height = 150,
  color = COLORS.primaryLight,
  opacity = 0.3,
  speed = 3000,
  inverted = false,
}: AnimatedWaveProps) {
  const progress = useContinuousAnimation({ duration: speed, reverse: true });

  const translateX = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [0, -SCREEN_WIDTH]);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Create wave path - more complex for organic look
  const createWavePath = () => {
    const amplitude = height * 0.4;
    const frequency = SCREEN_WIDTH / 4;

    let path = `M 0 ${height / 2}`;

    for (let x = 0; x <= SCREEN_WIDTH * 2; x += 10) {
      const y = Math.sin(x / frequency) * amplitude + height / 2;
      path += ` L ${x} ${y}`;
    }

    path += ` L ${SCREEN_WIDTH * 2} ${height} L 0 ${height} Z`;

    return path;
  };

  return (
    <View style={[styles.container, { height }, inverted && styles.inverted]}>
      <Animated.View style={[styles.waveContainer, animatedStyle]}>
        <Svg width={SCREEN_WIDTH * 2} height={height} style={styles.svg}>
          <Defs>
            <LinearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={opacity} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={createWavePath()} fill="url(#waveGradient)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

/**
 * Layered waves for more complex background
 */
export function LayeredWaves({ height = 200 }: { height?: number }) {
  return (
    <View style={[styles.layeredContainer, { height }]}>
      <AnimatedWave height={height} opacity={0.2} speed={4000} color={COLORS.primary} />
      <AnimatedWave height={height * 0.8} opacity={0.15} speed={5000} color={COLORS.accent} />
      <AnimatedWave height={height * 0.6} opacity={0.1} speed={6000} color={COLORS.primaryLight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    overflow: 'hidden',
  },
  inverted: {
    transform: [{ scaleY: -1 }],
  },
  waveContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 2,
  },
  svg: {
    position: 'absolute',
  },
  layeredContainer: {
    position: 'absolute',
    width: '100%',
  },
});
