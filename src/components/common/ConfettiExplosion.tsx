import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '@/src/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiPiece {
  id: number;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
  size: number;
  delay: number;
  duration: number;
}

interface ConfettiExplosionProps {
  active: boolean;
  origin?: { x: number; y: number };
  count?: number;
  colors?: string[];
  onComplete?: () => void;
  radius?: number;
}

/**
 * Celebratory confetti explosion effect
 * Perfect for success states, achievements, and gamification
 */
export function ConfettiExplosion({
  active,
  origin = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 },
  count = 50,
  colors = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, '#FFD700', '#FF69B4'],
  onComplete,
  radius = 300,
}: ConfettiExplosionProps) {
  const confetti = useMemo<ConfettiPiece[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = radius * (0.5 + Math.random() * 0.5);
      const endX = origin.x + Math.cos(angle) * distance;
      const endY = origin.y + Math.sin(angle) * distance + 200; // Add gravity

      return {
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        startX: origin.x,
        startY: origin.y,
        endX,
        endY,
        rotation: Math.random() * 720 - 360,
        size: 8 + Math.random() * 8,
        delay: Math.random() * 100,
        duration: 1000 + Math.random() * 500,
      };
    });
  }, [active, count, origin.x, origin.y, radius]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confetti.map((piece) => (
        <ConfettiPieceComponent
          key={piece.id}
          piece={piece}
          active={active}
          onComplete={piece.id === 0 ? onComplete : undefined}
        />
      ))}
    </View>
  );
}

function ConfettiPieceComponent({
  piece,
  active,
  onComplete,
}: {
  piece: ConfettiPiece;
  active: boolean;
  onComplete?: () => void;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    if (active) {
      // Initial explosion
      opacity.value = withDelay(piece.delay, withTiming(1, { duration: 50 }));
      scale.value = withDelay(
        piece.delay,
        withSequence(
          withTiming(1.2, { duration: 100, easing: Easing.out(Easing.cubic) }),
          withTiming(1, { duration: 100 })
        )
      );

      // Movement
      translateX.value = withDelay(
        piece.delay,
        withTiming(piece.endX - piece.startX, {
          duration: piece.duration,
          easing: Easing.out(Easing.quad),
        })
      );

      translateY.value = withDelay(
        piece.delay,
        withTiming(piece.endY - piece.startY, {
          duration: piece.duration,
          easing: Easing.in(Easing.quad), // Gravity effect
        })
      );

      rotate.value = withDelay(
        piece.delay,
        withTiming(piece.rotation, {
          duration: piece.duration,
          easing: Easing.out(Easing.ease),
        })
      );

      // Fade out near the end
      opacity.value = withDelay(
        piece.delay + piece.duration * 0.7,
        withTiming(0, { duration: piece.duration * 0.3 }, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        })
      );
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: piece.startX,
          top: piece.startY,
          width: piece.size,
          height: piece.size,
          backgroundColor: piece.color,
        },
        animatedStyle,
      ]}
    />
  );
}

/**
 * Full-screen confetti celebration
 * Triggers from bottom center and explodes upward
 */
export function SuccessConfetti({ active, onComplete }: { active: boolean; onComplete?: () => void }) {
  return (
    <ConfettiExplosion
      active={active}
      origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT }}
      count={60}
      radius={SCREEN_WIDTH * 0.8}
      onComplete={onComplete}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
});
