import { useEffect } from 'react';
import { useSharedValue, withSpring, withTiming, withDelay, withSequence, Easing } from 'react-native-reanimated';

export type EntranceAnimation = 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'bounce' | 'rotate';

interface UseAnimatedEntranceOptions {
  delay?: number;
  duration?: number;
  type?: EntranceAnimation;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
}

/**
 * Hook for creating smooth entrance animations with various effects
 * Returns animated values that can be used in Animated.View style transforms
 */
export function useAnimatedEntrance(options: UseAnimatedEntranceOptions = {}) {
  const {
    delay = 0,
    duration = 600,
    type = 'fade',
    springConfig = { damping: 15, stiffness: 150, mass: 1 },
  } = options;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(type === 'slideUp' ? 50 : type === 'slideDown' ? -50 : 0);
  const translateX = useSharedValue(type === 'slideLeft' ? 50 : type === 'slideRight' ? -50 : 0);
  const scale = useSharedValue(type === 'scale' || type === 'bounce' ? 0 : 1);
  const rotate = useSharedValue(type === 'rotate' ? 90 : 0);

  useEffect(() => {
    const animate = () => {
      if (type === 'bounce') {
        opacity.value = withDelay(delay, withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }));
        scale.value = withDelay(
          delay,
          withSequence(
            withSpring(1.2, { damping: 8, stiffness: 200 }),
            withSpring(1, springConfig)
          )
        );
      } else if (type === 'scale') {
        opacity.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.ease) }));
        scale.value = withDelay(delay, withSpring(1, springConfig));
      } else if (type === 'rotate') {
        opacity.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.ease) }));
        rotate.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 100 }));
      } else {
        // Slide or fade animations
        opacity.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
        translateY.value = withDelay(delay, withSpring(0, springConfig));
        translateX.value = withDelay(delay, withSpring(0, springConfig));
      }
    };

    animate();
  }, [delay, duration, type]);

  return {
    opacity,
    translateY,
    translateX,
    scale,
    rotate,
  };
}

/**
 * Hook for staggered entrance animations (for lists)
 */
export function useStaggeredEntrance(index: number, totalItems: number, baseDelay: number = 0, staggerDelay: number = 100) {
  const delay = baseDelay + (index * staggerDelay);
  return useAnimatedEntrance({ delay, type: 'slideUp' });
}

/**
 * Hook for scroll-driven animations
 */
export function useScrollAnimation() {
  const scrollY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  return {
    scrollY,
    opacity,
    scale,
  };
}
