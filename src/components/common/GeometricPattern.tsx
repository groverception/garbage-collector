import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated';
import { useContinuousAnimation, useRotationAnimation } from '@/src/hooks/useContinuousAnimation';
import { COLORS } from '@/src/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GeometricPatternProps {
  variant?: 'grid' | 'circles' | 'hexagons';
  color?: string;
  opacity?: number;
}

/**
 * Animated geometric pattern background
 * Minimalist design with subtle motion
 */
export function GeometricPattern({
  variant = 'circles',
  color = COLORS.primary,
  opacity = 0.05,
}: GeometricPatternProps) {
  if (variant === 'circles') {
    return <CirclePattern color={color} opacity={opacity} />;
  }

  if (variant === 'grid') {
    return <GridPattern color={color} opacity={opacity} />;
  }

  return <HexagonPattern color={color} opacity={opacity} />;
}

function CirclePattern({ color, opacity }: { color: string; opacity: number }) {
  const circles = [
    { size: 300, top: -100, left: -50 },
    { size: 200, top: 200, right: -30 },
    { size: 250, bottom: -80, left: 50 },
    { size: 180, top: '40%', right: -60 },
  ];

  return (
    <View style={styles.container} pointerEvents="none">
      {circles.map((circle, index) => (
        <AnimatedCircle
          key={index}
          size={circle.size}
          position={circle}
          color={color}
          opacity={opacity}
          delay={index * 500}
        />
      ))}
    </View>
  );
}

function AnimatedCircle({
  size,
  position,
  color,
  opacity,
  delay,
}: {
  size: number;
  position: any;
  color: string;
  opacity: number;
  delay: number;
}) {
  const progress = useContinuousAnimation({ duration: 5000 + delay, reverse: true });

  const scale = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [1, 1.15, 1]);
  });

  const circleOpacity = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [opacity, opacity * 1.5, opacity]);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: circleOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: color,
          ...position,
        },
        animatedStyle,
      ]}
    />
  );
}

function GridPattern({ color, opacity }: { color: string; opacity: number }) {
  const gridSize = 50;
  const rows = Math.ceil(800 / gridSize);
  const cols = Math.ceil(SCREEN_WIDTH / gridSize);

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.grid}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          return (
            <View
              key={i}
              style={[
                styles.gridCell,
                {
                  width: gridSize,
                  height: gridSize,
                  borderColor: color,
                  opacity: opacity * (1 + Math.sin((row + col) * 0.3) * 0.5),
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

function HexagonPattern({ color, opacity }: { color: string; opacity: number }) {
  // Simplified hexagon pattern using rotated squares
  const rotation = useRotationAnimation({ duration: 20000 });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.hexContainer, animatedStyle]}>
        {[0, 60, 120].map((angle) => (
          <View
            key={angle}
            style={[
              styles.hexLine,
              {
                backgroundColor: color,
                opacity,
                transform: [{ rotate: `${angle}deg` }],
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    borderWidth: 0.5,
  },
  hexContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 2,
    height: SCREEN_WIDTH * 2,
    top: -SCREEN_WIDTH / 2,
    left: -SCREEN_WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexLine: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.5,
    height: 1,
  },
});
