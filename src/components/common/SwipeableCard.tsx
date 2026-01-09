import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/src/constants/colors';
import { normalize } from '@/src/utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const SNAP_POINT = 100;

type SwipeAction = 'delete' | 'archive' | 'edit' | 'favorite';

interface SwipeableCardProps {
  children: ReactNode;
  leftActions?: {
    action: SwipeAction;
    onPress: () => void;
    color?: string;
    icon?: string;
  }[];
  rightActions?: {
    action: SwipeAction;
    onPress: () => void;
    color?: string;
    icon?: string;
  }[];
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  style?: ViewStyle;
  haptic?: boolean;
}

/**
 * Modern swipeable card with action buttons
 * Supports left and right swipe actions with smooth animations
 */
export function SwipeableCard({
  children,
  leftActions,
  rightActions,
  onSwipeLeft,
  onSwipeRight,
  style,
  haptic = true,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const height = useSharedValue(0);
  const opacity = useSharedValue(1);

  const triggerHaptic = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    // Animate out
    translateX.value = withTiming(direction === 'left' ? -SCREEN_WIDTH : SCREEN_WIDTH, {
      duration: 300,
    });
    opacity.value = withTiming(0, { duration: 300 });
    height.value = withTiming(0, { duration: 300 });

    // Execute callback
    setTimeout(() => {
      if (direction === 'left' && onSwipeLeft) {
        onSwipeLeft();
      } else if (direction === 'right' && onSwipeRight) {
        onSwipeRight();
      }
    }, 300);
  };

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const newTranslateX = ctx.startX + event.translationX;

      // Limit swipe distance
      if (leftActions && newTranslateX > 0) {
        translateX.value = Math.min(newTranslateX, SNAP_POINT);
      } else if (rightActions && newTranslateX < 0) {
        translateX.value = Math.max(newTranslateX, -SNAP_POINT);
      }

      // Haptic feedback at threshold
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD && haptic) {
        runOnJS(triggerHaptic)();
      }
    },
    onEnd: (event) => {
      const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD && rightActions;
      const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD && leftActions;

      if (shouldSwipeLeft) {
        runOnJS(handleSwipeComplete)('left');
      } else if (shouldSwipeRight) {
        runOnJS(handleSwipeComplete)('right');
      } else {
        // Snap back
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
      height: height.value === 0 ? height.value : undefined,
    };
  });

  const leftActionStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SNAP_POINT],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  const rightActionStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SNAP_POINT, 0],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <View style={[styles.container, style]}>
      {/* Left actions */}
      {leftActions && (
        <Animated.View style={[styles.actionsContainer, styles.leftActions, leftActionStyle]}>
          {leftActions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon || getDefaultIcon(action.action)}
              color={action.color || getDefaultColor(action.action)}
              onPress={action.onPress}
            />
          ))}
        </Animated.View>
      )}

      {/* Right actions */}
      {rightActions && (
        <Animated.View style={[styles.actionsContainer, styles.rightActions, rightActionStyle]}>
          {rightActions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon || getDefaultIcon(action.action)}
              color={action.color || getDefaultColor(action.action)}
              onPress={action.onPress}
            />
          ))}
        </Animated.View>
      )}

      {/* Card content */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, animatedCardStyle]}>{children}</Animated.View>
      </PanGestureHandler>
    </View>
  );
}

function ActionButton({
  icon,
  color,
  onPress,
}: {
  icon: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Animated.View style={[styles.actionButton, { backgroundColor: color }]}>
      <FontAwesome name={icon as any} size={24} color="#FFF" />
    </Animated.View>
  );
}

function getDefaultIcon(action: SwipeAction): string {
  const icons: Record<SwipeAction, string> = {
    delete: 'trash',
    archive: 'archive',
    edit: 'edit',
    favorite: 'heart',
  };
  return icons[action];
}

function getDefaultColor(action: SwipeAction): string {
  const colors: Record<SwipeAction, string> = {
    delete: COLORS.error,
    archive: COLORS.warning,
    edit: COLORS.accent,
    favorite: '#FF1493',
  };
  return colors[action];
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: normalize(8),
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: normalize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
  },
  leftActions: {
    left: 0,
    flexDirection: 'row',
  },
  rightActions: {
    right: 0,
    flexDirection: 'row-reverse',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: normalize(4),
  },
});
