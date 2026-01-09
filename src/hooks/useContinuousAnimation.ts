import { useEffect } from 'react';
import { useSharedValue, withRepeat, withTiming, withSequence, Easing, cancelAnimation } from 'react-native-reanimated';

interface ContinuousAnimationOptions {
  duration?: number;
  reverse?: boolean;
  easing?: any;
}

/**
 * Hook for continuous looping animations (for morphing backgrounds, floating elements)
 */
export function useContinuousAnimation(options: ContinuousAnimationOptions = {}) {
  const {
    duration = 3000,
    reverse = true,
    easing = Easing.inOut(Easing.ease),
  } = options;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing }),
      -1, // infinite repeats
      reverse
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [duration, reverse]);

  return progress;
}

/**
 * Hook for floating/hovering animation
 */
export function useFloatingAnimation(options: { distance?: number; duration?: number } = {}) {
  const { distance = 10, duration = 2000 } = options;

  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-distance, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(translateY);
    };
  }, [distance, duration]);

  return translateY;
}

/**
 * Hook for pulsing/breathing animation
 */
export function usePulseAnimation(options: { scale?: number; duration?: number } = {}) {
  const { scale = 1.1, duration = 1500 } = options;

  const scaleValue = useSharedValue(1);

  useEffect(() => {
    scaleValue.value = withRepeat(
      withSequence(
        withTiming(scale, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(scaleValue);
    };
  }, [scale, duration]);

  return scaleValue;
}

/**
 * Hook for rotation animation
 */
export function useRotationAnimation(options: { duration?: number; clockwise?: boolean } = {}) {
  const { duration = 10000, clockwise = true } = options;

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(clockwise ? 360 : -360, { duration, easing: Easing.linear }),
      -1,
      false
    );

    return () => {
      cancelAnimation(rotation);
    };
  }, [duration, clockwise]);

  return rotation;
}

/**
 * Hook for wave/oscillation animation
 */
export function useWaveAnimation(options: { amplitude?: number; frequency?: number } = {}) {
  const { amplitude = 1, frequency = 2000 } = options;

  const wave = useSharedValue(0);

  useEffect(() => {
    wave.value = withRepeat(
      withSequence(
        withTiming(amplitude, { duration: frequency, easing: Easing.sin }),
        withTiming(-amplitude, { duration: frequency, easing: Easing.sin })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(wave);
    };
  }, [amplitude, frequency]);

  return wave;
}
