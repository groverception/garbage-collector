import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { COLORS } from '@/src/constants/colors';
import { normalize } from '@/src/utils/responsive';

interface Card3DProps {
  children: ReactNode;
  style?: ViewStyle;
  intensity?: number;
  enableHover?: boolean;
  onPress?: () => void;
}

/**
 * 3D card with tilt effect on hover/press
 * Modern depth effect that responds to user interaction
 */
export function Card3D({
  children,
  style,
  intensity = 1,
  enableHover = true,
  onPress,
}: Card3DProps) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const elevation = useSharedValue(4);

  const MAX_ROTATION = 15 * intensity;

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      if (enableHover) {
        scale.value = withSpring(1.02, { damping: 15, stiffness: 200 });
        elevation.value = withSpring(8, { damping: 15, stiffness: 200 });
      }
    })
    .onUpdate((event) => {
      if (enableHover) {
        // Calculate rotation based on gesture position
        // Normalize to -1 to 1 range
        const normalizedX = (event.x / 300) * 2 - 1;
        const normalizedY = (event.y / 300) * 2 - 1;

        rotateY.value = withSpring(normalizedX * MAX_ROTATION, {
          damping: 15,
          stiffness: 150,
        });

        rotateX.value = withSpring(-normalizedY * MAX_ROTATION, {
          damping: 15,
          stiffness: 150,
        });
      }
    })
    .onEnd(() => {
      rotateX.value = withSpring(0, { damping: 15, stiffness: 200 });
      rotateY.value = withSpring(0, { damping: 15, stiffness: 200 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      elevation.value = withSpring(4, { damping: 15, stiffness: 200 });
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
      setTimeout(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        onPress();
      }, 100);
    }
  });

  const composed = Gesture.Race(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(
      elevation.value,
      [4, 8],
      [0.1, 0.2],
      Extrapolate.CLAMP
    );

    const shadowRadius = interpolate(
      elevation.value,
      [4, 8],
      [8, 16],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
        { scale: scale.value },
      ],
      shadowOpacity,
      shadowRadius,
      elevation: elevation.value,
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.card, animatedStyle, style]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

/**
 * Floating 3D card with subtle continuous animation
 */
export function FloatingCard3D({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withSpring(-5, {
      damping: 5,
      stiffness: 50,
    });

    rotate.value = withSpring(2, {
      damping: 10,
      stiffness: 80,
    });

    const interval = setInterval(() => {
      translateY.value = withSpring(translateY.value === -5 ? 0 : -5, {
        damping: 5,
        stiffness: 50,
      });

      rotate.value = withSpring(rotate.value === 2 ? -2 : 2, {
        damping: 10,
        stiffness: 80,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { translateY: translateY.value },
        { rotateZ: `${rotate.value}deg` },
      ],
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: normalize(16),
    padding: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
