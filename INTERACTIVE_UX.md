# 🎮 Interactive UX Components - 2025/2026 Modern Design

This document showcases the cutting-edge interactive UX components added to make your Garbage Collector app stand out with modern, attention-grabbing interactions inspired by the latest web and mobile trends.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Glassmorphism Effects](#glassmorphism-effects)
3. [Interactive Buttons](#interactive-buttons)
4. [Celebration Animations](#celebration-animations)
5. [Loading States](#loading-states)
6. [Swipe Gestures](#swipe-gestures)
7. [3D Transformations](#3d-transformations)
8. [Pull-to-Refresh](#pull-to-refresh)
9. [Implementation Examples](#implementation-examples)
10. [Best Practices](#best-practices)

---

## Overview

All components are built with:
- ✅ **React Native Reanimated 4.1** for 60fps animations
- ✅ **Gesture Handler 2.28** for smooth touch interactions
- ✅ **Expo Haptics** for tactile feedback
- ✅ **Expo Blur** for modern glassmorphism effects
- ✅ **TypeScript** for type safety

**Design Inspiration:**
- Duolingo (gamification & celebrations)
- Headspace (calming animations)
- Stripe (smooth interactions)
- Apple (polish & spring physics)
- Notion (modern UI)
- Linear (minimal but engaging)

---

## Glassmorphism Effects

### `GlassCard`

Modern frosted glass effect with blur and transparency - one of the hottest 2025-2026 design trends.

```typescript
import { GlassCard } from '@/src/components/common/GlassCard';

<GlassCard
  intensity={80}           // Blur intensity (0-100)
  tint="light"            // 'light' | 'dark' | 'default'
  borderRadius={16}       // Corner radius
  pressable={true}        // Enable press animation
  onPress={() => {}}      // Press handler
>
  <Text>Content with frosted glass background</Text>
</GlassCard>
```

**Features:**
- Automatic blur effect on native (BlurView)
- Fallback for web with CSS backdrop-filter
- Semi-transparent background with border glow
- Press animation (scales to 0.98)
- Customizable blur intensity and tint

**Use Cases:**
- Modal overlays
- Floating action buttons
- Premium feature cards
- Navigation bars
- Settings panels

**Visual Effect:**
- Semi-transparent white background (10% opacity)
- Subtle border (20% white opacity)
- Soft shadow for depth
- Blur effect creates depth separation

---

## Interactive Buttons

### `RippleButton`

Material Design 3-style button with ripple effect and haptic feedback.

```typescript
import { RippleButton } from '@/src/components/common/RippleButton';

<RippleButton
  title="Press Me"
  onPress={() => console.log('Pressed!')}
  variant="primary"        // 'primary' | 'secondary' | 'outline' | 'ghost'
  size="medium"           // 'small' | 'medium' | 'large'
  haptic={true}           // Enable haptic feedback
  rippleColor="#C8E6C9"   // Custom ripple color
  icon={<Icon name="star" />}
  disabled={false}
  loading={false}
/>
```

**Animation Sequence:**
1. **Tap Begin**: Button scales to 0.95
2. **Ripple Start**: Circular ripple expands from center
3. **Haptic Feedback**: Medium impact vibration
4. **Tap End**: Button springs back to scale 1.0
5. **Ripple Fade**: Ripple fades out over 600ms

**Features:**
- Gesture Handler for smooth touch
- Spring physics (damping: 15, stiffness: 400)
- Customizable ripple color
- Multiple variants and sizes
- Built-in loading and disabled states
- Optional icon support

**Best Practices:**
- Use `primary` for main CTAs
- Use `outline` for secondary actions
- Use `ghost` for tertiary actions
- Enable haptic for important actions
- Keep ripple color slightly lighter than button color

---

## Celebration Animations

### `ConfettiExplosion`

Celebratory confetti explosion for success states and achievements.

```typescript
import { ConfettiExplosion, SuccessConfetti } from '@/src/components/common/ConfettiExplosion';

// Custom confetti from specific origin
<ConfettiExplosion
  active={showConfetti}
  origin={{ x: 200, y: 300 }}
  count={50}
  colors={['#4CAF50', '#FF9800', '#03A9F4']}
  radius={300}
  onComplete={() => setShowConfetti(false)}
/>

// Pre-configured success confetti (bottom-up)
<SuccessConfetti
  active={uploadSuccess}
  onComplete={() => setUploadSuccess(false)}
/>
```

**Animation Details:**
- Each confetti piece has unique trajectory
- Realistic gravity simulation (falls downward)
- Random rotation (±360°)
- Size variation (8-16px)
- Staggered timing for organic feel
- Fade out near end of animation
- Duration: 1000-1500ms per piece

**Use Cases:**
- Task completion
- Upload success
- Achievement unlocks
- Milestone celebrations
- Form submission success
- Goal completion

**Customization:**
- `count`: Number of pieces (recommended: 30-60)
- `radius`: Explosion radius (recommended: screen width * 0.8)
- `colors`: Array of hex colors
- `origin`: Start point { x, y }

---

## Loading States

### `ShimmerSkeleton`

Modern animated placeholder that reduces perceived loading time.

```typescript
import {
  ShimmerSkeleton,
  CardSkeleton,
  ListItemSkeleton,
  ImageSkeleton,
  TextBlockSkeleton
} from '@/src/components/common/ShimmerSkeleton';

// Basic shimmer
<ShimmerSkeleton width="100%" height={20} borderRadius={8} />

// Pre-built layouts
<CardSkeleton />
<ListItemSkeleton />
<ImageSkeleton aspectRatio={16/9} />
<TextBlockSkeleton lines={3} />
```

**Animation:**
- Continuous shimmer animation (1500ms cycle)
- Gradient overlay moves left to right
- Smooth, infinite loop
- Low CPU usage (worklet-based)

**Pre-built Layouts:**

1. **CardSkeleton**
   - 80x80 thumbnail (left)
   - 3 text lines of varying width
   - Perfect for list cards

2. **ListItemSkeleton**
   - 50x50 circular avatar
   - 2 text lines
   - Ideal for chat/user lists

3. **ImageSkeleton**
   - Maintains aspect ratio
   - Rounded corners
   - Full-width responsive

4. **TextBlockSkeleton**
   - Multiple lines
   - Last line shorter (60% width)
   - Simulates paragraph

**Best Practices:**
- Use during API calls
- Match skeleton to actual content layout
- Keep skeleton count reasonable (3-5 items)
- Fade from skeleton to real content
- Combine with pull-to-refresh

---

## Swipe Gestures

### `SwipeableCard`

Card with left/right swipe actions - perfect for quick actions.

```typescript
import { SwipeableCard } from '@/src/components/common/SwipeableCard';

<SwipeableCard
  leftActions={[
    {
      action: 'favorite',
      onPress: () => handleFavorite(),
      color: '#FF1493',
      icon: 'heart'
    }
  ]}
  rightActions={[
    {
      action: 'edit',
      onPress: () => handleEdit()
    },
    {
      action: 'delete',
      onPress: () => handleDelete()
    }
  ]}
  onSwipeLeft={() => handleDelete()}
  onSwipeRight={() => handleFavorite()}
  haptic={true}
>
  <YourCardContent />
</SwipeableCard>
```

**Gesture Mechanics:**
- Swipe threshold: 30% of screen width
- Snap point: 100px
- Actions appear behind card as you swipe
- Elastic resistance at boundaries
- Haptic feedback when crossing threshold

**Animation States:**
1. **Resting**: translateX = 0
2. **Swiping**: translateX follows gesture
3. **Snapped**: translateX = ±100 (action buttons visible)
4. **Full Swipe**: Card animates off screen

**Default Actions:**
- `delete` - Red with trash icon
- `archive` - Orange with archive icon
- `edit` - Blue with edit icon
- `favorite` - Pink with heart icon

**Use Cases:**
- Email inbox
- Task lists
- Shopping carts
- Message threads
- Image galleries

---

## 3D Transformations

### `Card3D`

Interactive 3D card with tilt effect on hover/press.

```typescript
import { Card3D, FloatingCard3D } from '@/src/components/common/Card3D';

// Interactive 3D tilt
<Card3D
  intensity={1}           // Rotation intensity multiplier
  enableHover={true}      // Enable tilt on hover/pan
  onPress={() => {}}      // Tap handler
>
  <YourContent />
</Card3D>

// Floating card with subtle continuous animation
<FloatingCard3D>
  <YourContent />
</FloatingCard3D>
```

**Animation Details:**

**Card3D (Interactive):**
- Max rotation: ±15° (adjustable with intensity)
- Responds to pan gesture position
- Scales up slightly on interaction (1.02x)
- Shadow depth increases
- Spring physics for smooth return

**FloatingCard3D (Continuous):**
- Subtle vertical float (-5px to 0px)
- Gentle rotation (±2°)
- 3-second cycles
- Always active, ambient motion

**Implementation:**
- Uses perspective: 1000
- RotateX and RotateY for 3D effect
- Shadow interpolation for depth
- Spring damping: 15, stiffness: 150

**Best Practices:**
- Use sparingly (1-2 per screen)
- Great for feature cards
- Hero elements
- Premium content showcase
- Interactive galleries

---

## Pull-to-Refresh

### `PullToRefresh`

Custom pull-to-refresh with organic animation and elastic physics.

```typescript
import { PullToRefresh } from '@/src/components/common/PullToRefresh';

<PullToRefresh
  onRefresh={async () => {
    await fetchData();
  }}
  enabled={true}
>
  <ScrollView>
    {/* Your content */}
  </ScrollView>
</PullToRefresh>
```

**Animation Sequence:**
1. **Pull Down**: Icon scales and rotates (0° → 180°)
2. **Threshold Reached**: Haptic feedback
3. **Release**: Icon snaps to loading position
4. **Loading**: Continuous rotation animation
5. **Complete**: Smooth spring back to top

**Features:**
- Pull threshold: 80px
- Max pull: 120px (elastic resistance)
- Refresh icon in floating bubble
- Smooth spring physics
- Haptic feedback on trigger
- Elastic resistance effect

**States:**
- **Idle**: Icon hidden
- **Pulling**: Icon scales and rotates based on pull distance
- **Loading**: Icon spins continuously
- **Complete**: Icon fades and content springs back

---

## Implementation Examples

### Example 1: Enhanced Upload Success

```typescript
import { SuccessConfetti } from '@/src/components/common/ConfettiExplosion';
import { GlassCard } from '@/src/components/common/GlassCard';
import { RippleButton } from '@/src/components/common/RippleButton';

function UploadSuccess() {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleUpload = async () => {
    // Upload logic...
    setShowConfetti(true);
  };

  return (
    <>
      <GlassCard intensity={90} tint="light">
        <Text style={styles.title}>Upload Complete!</Text>
        <Text style={styles.message}>
          Your report has been submitted successfully
        </Text>
        <RippleButton
          title="View Report"
          onPress={() => navigate('/history')}
          variant="primary"
          size="large"
          haptic={true}
        />
      </GlassCard>

      <SuccessConfetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </>
  );
}
```

### Example 2: Interactive Task List

```typescript
import { SwipeableCard } from '@/src/components/common/SwipeableCard';
import { Card3D } from '@/src/components/common/Card3D';
import { ShimmerSkeleton, CardSkeleton } from '@/src/components/common/ShimmerSkeleton';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </>
    );
  }

  return tasks.map(task => (
    <SwipeableCard
      key={task.id}
      leftActions={[
        { action: 'favorite', onPress: () => handleFavorite(task.id) }
      ]}
      rightActions={[
        { action: 'delete', onPress: () => handleDelete(task.id) }
      ]}
      haptic={true}
    >
      <Card3D enableHover={true} onPress={() => handleView(task)}>
        <TaskContent task={task} />
      </Card3D>
    </SwipeableCard>
  ));
}
```

### Example 3: Pull-to-Refresh Feed

```typescript
import { PullToRefresh } from '@/src/components/common/PullToRefresh';
import { FloatingCard3D } from '@/src/components/common/Card3D';

function FeedScreen() {
  const [items, setItems] = useState([]);

  const handleRefresh = async () => {
    const newItems = await fetchLatestItems();
    setItems(newItems);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <ScrollView>
        {items.map(item => (
          <FloatingCard3D key={item.id}>
            <FeedItem item={item} />
          </FloatingCard3D>
        ))}
      </ScrollView>
    </PullToRefresh>
  );
}
```

---

## Best Practices

### Performance Optimization

1. **Use Worklets**
   - All animation logic should use `'worklet'` directive
   - Keeps animations on UI thread (60fps)

2. **Limit Concurrent Animations**
   - Max 3-5 animated elements per screen
   - Stagger complex animations

3. **Optimize Gesture Handlers**
   ```typescript
   const pan = Gesture.Pan()
     .activeOffsetX([-10, 10])  // Prevent accidental triggers
     .failOffsetY([-5, 5]);     // Prevent conflicts with scroll
   ```

4. **Cleanup Animations**
   ```typescript
   useEffect(() => {
     rotation.value = withRepeat(withTiming(360), -1);

     return () => {
       cancelAnimation(rotation);
     };
   }, []);
   ```

### Haptic Feedback Guidelines

**When to use:**
- ✅ Important button presses
- ✅ Gesture completion (swipe threshold)
- ✅ Success/error states
- ✅ Pull-to-refresh trigger

**When NOT to use:**
- ❌ Every touch interaction
- ❌ Scrolling
- ❌ Hovering
- ❌ Passive animations

**Impact Levels:**
- `Light` - Subtle touches, secondary actions
- `Medium` - Primary actions, confirmations
- `Heavy` - Critical actions, deletions

### Animation Timing

**Entrance Animations:**
- Fast: 200-300ms (buttons, simple fades)
- Normal: 400-600ms (cards, modals)
- Slow: 800-1000ms (page transitions)

**Exit Animations:**
- 20% faster than entrance
- Example: 300ms entrance → 250ms exit

**Continuous Animations:**
- Slow and subtle (2-4 seconds per cycle)
- Low opacity/scale changes
- Never distracting

### Spring Physics Recommendations

```typescript
// Quick, snappy
{ damping: 25, stiffness: 400 }

// Balanced, default
{ damping: 15, stiffness: 150 }

// Bouncy, playful
{ damping: 10, stiffness: 200 }

// Gentle, smooth
{ damping: 30, stiffness: 200 }
```

### Accessibility

1. **Respect System Preferences**
   ```typescript
   import { AccessibilityInfo } from 'react-native';

   const [reduceMotion, setReduceMotion] = useState(false);

   useEffect(() => {
     AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
   }, []);
   ```

2. **Provide Alternatives**
   - Disable continuous animations if reduce motion is enabled
   - Keep essential animations (user-triggered only)
   - Reduce duration by 50% when reduce motion is on

3. **Ensure Touch Targets**
   - Minimum 44x44 points
   - Extra padding on swipeable elements
   - Clear visual feedback

---

## Component Comparison

| Component | Use Case | Performance | Complexity | Wow Factor |
|-----------|----------|-------------|------------|------------|
| **GlassCard** | Overlays, modals | Medium | Low | ★★★★☆ |
| **RippleButton** | Primary actions | High | Low | ★★★★★ |
| **ConfettiExplosion** | Celebrations | Medium | Medium | ★★★★★ |
| **ShimmerSkeleton** | Loading states | High | Low | ★★★☆☆ |
| **SwipeableCard** | List actions | High | Medium | ★★★★☆ |
| **Card3D** | Feature showcase | Medium | Medium | ★★★★★ |
| **PullToRefresh** | Feed refresh | High | Medium | ★★★★☆ |

---

## Dependencies

All components require:

```json
{
  "react-native-reanimated": "~4.1.1",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-worklets": "0.5.1",
  "expo-blur": "latest",
  "expo-haptics": "latest",
  "@expo/vector-icons": "^15.0.3"
}
```

---

## Future Enhancements

Potential additions:

1. **Lottie Integration** - High-quality vector animations
2. **Shared Element Transitions** - Smooth navigation
3. **Particle Systems** - More complex effects
4. **Magnetic Buttons** - Elements that attract to touch
5. **Gesture Combinations** - Multi-finger interactions
6. **Voice Feedback** - Audio cues for actions
7. **Theme Transitions** - Animated light/dark mode switch

---

**Built with passion for modern, engaging UX** 🎨✨

Your app now has enterprise-grade interactive components that rival the best apps of 2025-2026!
