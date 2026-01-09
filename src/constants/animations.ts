import { Easing } from 'react-native-reanimated';

/**
 * Centralized animation constants for consistent motion design
 */

export const ANIMATION_DURATIONS = {
  instant: 0,
  fast: 200,
  normal: 300,
  moderate: 400,
  slow: 600,
  verySlow: 800,
  ultra: 1000,
  continuous: 3000,
} as const;

export const SPRING_CONFIGS = {
  // Gentle spring (subtle animations)
  gentle: {
    damping: 20,
    stiffness: 120,
    mass: 1,
  },
  // Default spring (balanced)
  default: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  // Bouncy spring (playful animations)
  bouncy: {
    damping: 10,
    stiffness: 200,
    mass: 1,
  },
  // Snappy spring (quick response)
  snappy: {
    damping: 25,
  stiffness: 300,
    mass: 0.8,
  },
  // Wobbly spring (exaggerated bounce)
  wobbly: {
    damping: 8,
    stiffness: 180,
    mass: 1.2,
  },
  // Smooth spring (no bounce)
  smooth: {
    damping: 30,
    stiffness: 200,
    mass: 1,
  },
} as const;

export const EASING_FUNCTIONS = {
  // Entrance animations
  easeOut: Easing.out(Easing.cubic),
  easeOutQuad: Easing.out(Easing.quad),
  easeOutExpo: Easing.out(Easing.exp),

  // Exit animations
  easeIn: Easing.in(Easing.cubic),
  easeInQuad: Easing.in(Easing.quad),

  // Both directions
  easeInOut: Easing.inOut(Easing.cubic),
  easeInOutQuad: Easing.inOut(Easing.quad),

  // Special effects
  elastic: Easing.elastic(2),
  bounce: Easing.bounce,
  bezier: Easing.bezier(0.25, 0.1, 0.25, 1),

  // Linear
  linear: Easing.linear,

  // Sine wave (for continuous animations)
  sine: Easing.sin,
} as const;

export const STAGGER_DELAYS = {
  fast: 50,
  normal: 100,
  slow: 150,
  verySlow: 200,
} as const;

export const PARALLAX_FACTORS = {
  background: 0.3,
  midground: 0.6,
  foreground: 1,
  overlay: 1.3,
} as const;

export const SCALE_FACTORS = {
  small: 0.95,
  medium: 0.98,
  large: 1.05,
  extraLarge: 1.1,
  bounce: 1.2,
} as const;

export const ROTATION_ANGLES = {
  slight: 5,
  medium: 15,
  large: 30,
  full: 360,
} as const;

export const OPACITY_VALUES = {
  invisible: 0,
  faint: 0.1,
  subtle: 0.3,
  medium: 0.5,
  strong: 0.7,
  almostVisible: 0.9,
  visible: 1,
} as const;
