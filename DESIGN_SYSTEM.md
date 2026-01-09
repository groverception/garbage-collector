# 🎨 Modern Design System & Animation Library

This document outlines the comprehensive design system and animation library added to the Garbage Collector app, featuring bold and experimental modern abstract designs.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Animation Hooks](#animation-hooks)
3. [Abstract Graphic Components](#abstract-graphic-components)
4. [Implementation Examples](#implementation-examples)
5. [Animation Constants](#animation-constants)
6. [Best Practices](#best-practices)

---

## Overview

The design system introduces a **bold, experimental aesthetic** with:
- ✨ **Morphing gradient blobs** that continuously animate
- 🌊 **Layered wave patterns** with organic motion
- 🎯 **Geometric minimalist patterns** (circles, grids, hexagons)
- 🍃 **Floating nature-inspired particles** (leaves, recycle icons, flowers)
- 📐 **Parallax scroll effects** for depth and immersion
- 🎭 **Entrance animations** with spring physics
- 💫 **Continuous animations** (pulse, rotate, float)

---

## Animation Hooks

### `useAnimatedEntrance`

Creates smooth entrance animations for components when they mount or appear.

```typescript
import { useAnimatedEntrance } from '@/src/hooks/useAnimatedEntrance';

// Available animation types
type EntranceAnimation =
  | 'fade'       // Simple fade in
  | 'slideUp'    // Slide from bottom
  | 'slideDown'  // Slide from top
  | 'slideLeft'  // Slide from right
  | 'slideRight' // Slide from left
  | 'scale'      // Scale up from 0
  | 'bounce'     // Bounce scale effect
  | 'rotate';    // Rotate while appearing

// Usage
const entrance = useAnimatedEntrance({
  delay: 200,              // Delay before animation starts (ms)
  duration: 600,           // Animation duration (ms)
  type: 'bounce',          // Animation type
  springConfig: {          // Custom spring config (optional)
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
});

// Apply to Animated.View
<Animated.View style={{
  opacity: entrance.opacity,
  transform: [
    { translateY: entrance.translateY },
    { scale: entrance.scale },
  ],
}}>
  {/* Your content */}
</Animated.View>
```

### `useStaggeredEntrance`

For list items that should animate in sequence with a stagger effect.

```typescript
import { useStaggeredEntrance } from '@/src/hooks/useAnimatedEntrance';

// In a list render
items.map((item, index) => {
  const entrance = useStaggeredEntrance(
    index,          // Item index
    items.length,   // Total items
    0,             // Base delay
    100            // Stagger delay between items
  );

  return (
    <Animated.View style={{ opacity: entrance.opacity }} key={item.id}>
      {/* Item content */}
    </Animated.View>
  );
});
```

### `useContinuousAnimation`

Creates infinite looping animations for background elements.

```typescript
import { useContinuousAnimation } from '@/src/hooks/useContinuousAnimation';

const progress = useContinuousAnimation({
  duration: 3000,    // Full cycle duration
  reverse: true,     // Reverse back (0 -> 1 -> 0)
  easing: Easing.inOut(Easing.ease),
});

// Use with interpolate for custom animations
const scale = useDerivedValue(() => {
  return interpolate(progress.value, [0, 1], [1, 1.2]);
});
```

### `useFloatingAnimation`

Creates a floating/hovering effect for elements.

```typescript
import { useFloatingAnimation } from '@/src/hooks/useContinuousAnimation';

const translateY = useFloatingAnimation({
  distance: 10,    // How far to float (px)
  duration: 2000,  // Full cycle duration
});

<Animated.View style={{ transform: [{ translateY }] }}>
  {/* Floating element */}
</Animated.View>
```

### `usePulseAnimation`

Creates a pulsing/breathing scale effect.

```typescript
import { usePulseAnimation } from '@/src/hooks/useContinuousAnimation';

const scale = usePulseAnimation({
  scale: 1.1,      // Max scale factor
  duration: 1500,  // Full pulse cycle
});

<Animated.View style={{ transform: [{ scale }] }}>
  {/* Pulsing element */}
</Animated.View>
```

### `useRotationAnimation`

Continuous rotation animation.

```typescript
import { useRotationAnimation } from '@/src/hooks/useContinuousAnimation';

const rotation = useRotationAnimation({
  duration: 10000,    // Full rotation duration
  clockwise: true,    // Direction
});

<Animated.View style={{ transform: [{ rotate: `${rotation.value}deg` }] }}>
  {/* Rotating element */}
</Animated.View>
```

---

## Abstract Graphic Components

### `MorphingBlob`

Animated organic blob shape that morphs continuously with gradient effects.

```typescript
import { MorphingBlob } from '@/src/components/common/MorphingBlob';

<MorphingBlob
  size={400}
  colors={[COLORS.primary, COLORS.primaryLight]}
  duration={6000}
  opacity={0.15}
  style={{ top: -100, right: -100 }}
/>
```

**Props:**
- `size`: Blob diameter in pixels
- `colors`: Array of colors for gradient (currently uses first color)
- `duration`: Morphing animation cycle duration (ms)
- `opacity`: Blob opacity (0-1)
- `style`: Additional positioning styles

**Effect:**
- Continuously morphs shape using border radius animation
- Scales and rotates for organic feel
- Perfect for background decoration

### `AnimatedWave` & `LayeredWaves`

Flowing wave patterns using SVG paths with continuous animation.

```typescript
import { AnimatedWave, LayeredWaves } from '@/src/components/common/AnimatedWave';

// Single wave
<AnimatedWave
  height={150}
  color={COLORS.primaryLight}
  opacity={0.3}
  speed={3000}
  inverted={false}
/>

// Multiple layered waves
<LayeredWaves height={200} />
```

**Props (AnimatedWave):**
- `height`: Wave container height
- `color`: Wave color
- `opacity`: Wave opacity
- `speed`: Animation speed (ms)
- `inverted`: Flip wave vertically

**Effect:**
- Creates smooth sine wave motion
- Infinite horizontal scrolling
- Layered version stacks 3 waves at different speeds

### `FloatingParticles`

Particle system with nature/eco-themed icons that float and rotate.

```typescript
import { FloatingParticles } from '@/src/components/common/FloatingParticles';

<FloatingParticles
  count={15}
  icons={['leaf', 'recycle', 'flower', 'tree', 'sprout', 'water']}
  colors={[COLORS.primary, COLORS.accent, COLORS.primaryLight]}
/>
```

**Props:**
- `count`: Number of particles to render
- `icons`: Array of MaterialCommunityIcons icon names
- `colors`: Array of colors to randomly assign

**Effect:**
- Each particle floats vertically with unique timing
- Rotates continuously
- Scales subtly for depth
- Random positioning across screen

### `GeometricPattern`

Minimalist geometric background patterns with subtle animations.

```typescript
import { GeometricPattern } from '@/src/components/common/GeometricPattern';

// Circle pattern (default)
<GeometricPattern
  variant="circles"
  color={COLORS.primary}
  opacity={0.05}
/>

// Grid pattern
<GeometricPattern variant="grid" />

// Hexagon pattern
<GeometricPattern variant="hexagons" />
```

**Props:**
- `variant`: Pattern type ('grid' | 'circles' | 'hexagons')
- `color`: Pattern color
- `opacity`: Pattern opacity

**Effects:**
- **Circles**: Animated concentric circles with pulsing scale
- **Grid**: Static grid with varying opacity based on position
- **Hexagons**: Rotating hexagonal pattern

---

## Implementation Examples

### Onboarding Screen

The onboarding flow now features:
- ✨ **Morphing blob backgrounds** (top-right and bottom-left)
- 🌊 **Layered wave animations**
- 🍃 **Floating particles** (leaves, recycle icons)
- 📐 **Parallax slide transitions** - icons and text move at different speeds
- 🎭 **Icon rotation and scale** during swipe
- 💫 **Text fade in/out** based on active slide

```typescript
// Background layer
<View style={styles.backgroundContainer}>
  <MorphingBlob
    size={400}
    colors={[COLORS.primary, COLORS.primaryLight]}
    duration={6000}
    opacity={0.15}
    style={{ top: -100, right: -100 }}
  />
  <LayeredWaves height={250} />
  <FloatingParticles count={12} />
</View>

// Parallax slides
{ONBOARDING_SLIDES.map((slide, index) => (
  <OnboardingSlide
    key={slide.id}
    slide={slide}
    index={index}
    scrollX={scrollX}  // Shared scroll value
  />
))}
```

### Home/Landing Screen

The home screen features:
- 🎯 **Geometric circle pattern** background
- ✨ **Multiple morphing blobs** in corners
- 🍃 **Floating eco-particles**
- 📜 **Scroll-driven parallax** on hero section
- 💫 **Hero icon pulse animation**
- 🎭 **Staggered entrance** for stats items
- 🎨 **Scale entrance** for impact cards
- 📊 **Slide-up entrance** for task cards

```typescript
// Scroll handler
const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  },
});

// Parallax hero
const heroAnimatedStyle = useAnimatedStyle(() => {
  const translateY = interpolate(
    scrollY.value,
    [0, 300],
    [0, -50],
    Extrapolate.CLAMP
  );
  return { transform: [{ translateY }] };
});

// Pulsing icon
const iconPulse = usePulseAnimation({ scale: 1.05, duration: 2000 });
```

---

## Animation Constants

Centralized animation configuration in `src/constants/animations.ts`:

### Duration Presets
```typescript
ANIMATION_DURATIONS = {
  instant: 0,
  fast: 200,
  normal: 300,
  moderate: 400,
  slow: 600,
  verySlow: 800,
  ultra: 1000,
  continuous: 3000,
}
```

### Spring Configurations
```typescript
SPRING_CONFIGS = {
  gentle: { damping: 20, stiffness: 120, mass: 1 },
  default: { damping: 15, stiffness: 150, mass: 1 },
  bouncy: { damping: 10, stiffness: 200, mass: 1 },
  snappy: { damping: 25, stiffness: 300, mass: 0.8 },
  wobbly: { damping: 8, stiffness: 180, mass: 1.2 },
  smooth: { damping: 30, stiffness: 200, mass: 1 },
}
```

### Parallax Factors
```typescript
PARALLAX_FACTORS = {
  background: 0.3,   // Slowest layer
  midground: 0.6,    // Middle layer
  foreground: 1,     // Normal speed
  overlay: 1.3,      // Fastest layer
}
```

---

## Best Practices

### 1. Performance Optimization

**Do:**
- ✅ Use `useAnimatedStyle` for all animated styles
- ✅ Keep animations on the UI thread when possible
- ✅ Use `worklets` for complex calculations
- ✅ Limit particle count on lower-end devices
- ✅ Use `pointerEvents="none"` on background decorations

**Don't:**
- ❌ Animate too many elements simultaneously
- ❌ Use heavy SVG filters in animations
- ❌ Create infinite loops without cleanup
- ❌ Animate layout properties (use transforms)

### 2. Layering Strategy

**Recommended Z-index layers:**
1. **Background patterns** (z-index: 0) - Geometric patterns, gradients
2. **Morphing blobs** (z-index: 1) - Large abstract shapes
3. **Wave animations** (z-index: 2) - Flowing waves
4. **Floating particles** (z-index: 3) - Small icons
5. **Content layer** (z-index: 10) - Actual UI elements

### 3. Accessibility

- Keep animations subtle enough not to cause motion sickness
- Consider adding a "Reduce Motion" setting that respects system preferences
- Ensure text remains readable over animated backgrounds (use opacity wisely)

### 4. Color Coordination

**Eco-friendly palette:**
- Primary green (#4CAF50) - Nature, growth, cleanliness
- Accent blue (#03A9F4) - Water, freshness
- Secondary orange (#FF9800) - Energy, action
- Light green (#C8E6C9) - Calm, subtle backgrounds

**Opacity guidelines:**
- Background blobs: 0.08 - 0.15
- Geometric patterns: 0.05 - 0.10
- Floating particles: 0.1 - 0.3
- Wave patterns: 0.1 - 0.3

### 5. Animation Timing

**Entrance animations:**
- Base delay: 200-400ms (let screen settle)
- Stagger delay: 50-150ms (for lists)
- Duration: 300-600ms (quick but noticeable)

**Continuous animations:**
- Background morphing: 6000-10000ms (very slow)
- Floating particles: 2000-7000ms (varied)
- Pulse effects: 1500-2000ms (heartbeat-like)
- Rotations: 10000-20000ms (glacial)

---

## Future Enhancements

Potential additions to the design system:

1. **Gradient Mesh Backgrounds** - Complex multi-color gradients
2. **Particle Burst Effects** - Celebration animations on success
3. **Liquid Morphing Shapes** - More advanced blob animations
4. **Skeleton Loading States** - Shimmer animations while loading
5. **Interactive Haptic Feedback** - Vibration on key interactions
6. **Parallax Depth Layers** - 3D-like depth with gyroscope
7. **Transition Choreography** - Shared element transitions
8. **Micro-interactions** - Button ripples, pull-to-refresh

---

## Dependencies

```json
{
  "react-native-reanimated": "~4.1.1",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-svg": "latest",
  "react-native-worklets": "0.5.1",
  "@expo/vector-icons": "^15.0.3"
}
```

---

**Built with ❤️ for bold, experimental, and modern UX**
