import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContinuousAnimation, useFloatingAnimation } from '@/src/hooks/useContinuousAnimation';
import { COLORS } from '@/src/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
  id: number;
  icon: any;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
}

interface FloatingParticlesProps {
  count?: number;
  icons?: any[];
  colors?: string[];
}

/**
 * Floating particle system with nature/eco icons
 * Creates ambient background animation
 */
export function FloatingParticles({
  count = 15,
  icons = ['leaf', 'recycle', 'flower', 'tree', 'sprout', 'water'],
  colors = [COLORS.primary, COLORS.accent, COLORS.primaryLight],
}: FloatingParticlesProps) {
  // Generate random particles
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      size: 20 + Math.random() * 30,
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT,
      duration: 3000 + Math.random() * 4000,
      delay: Math.random() * 2000,
      opacity: 0.1 + Math.random() * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [count]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <FloatingParticle key={particle.id} particle={particle} />
      ))}
    </View>
  );
}

function FloatingParticle({ particle }: { particle: Particle }) {
  const translateY = useFloatingAnimation({
    distance: 20 + Math.random() * 30,
    duration: particle.duration,
  });

  const progress = useContinuousAnimation({
    duration: particle.duration + 2000,
    reverse: true,
  });

  const rotate = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [0, 360]);
  });

  const scale = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [1, 1.2, 1]);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
          opacity: particle.opacity,
        },
        animatedStyle,
      ]}
    >
      <MaterialCommunityIcons
        name={particle.icon}
        size={particle.size}
        color={particle.color}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
  },
});
