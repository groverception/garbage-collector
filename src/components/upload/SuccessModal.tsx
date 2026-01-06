import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, normalize } from '../../utils/responsive';
import { Button } from '../common/Button';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SuccessModal({ visible, onClose }: SuccessModalProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withSpring(1);
      scale.value = withSpring(1, { damping: 12 });
      checkScale.value = withDelay(200, withSpring(1, { damping: 10 }));
    } else {
      opacity.value = 0;
      scale.value = 0;
      checkScale.value = 0;
    }
  }, [visible, opacity, scale, checkScale]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Animated.View style={[styles.container, containerStyle]}>
          <Animated.View style={[styles.iconContainer, checkStyle]}>
            <FontAwesome name="check" size={normalize(50)} color={COLORS.textLight} />
          </Animated.View>
          <Text style={styles.title}>Upload Successful!</Text>
          <Text style={styles.message}>
            Thank you for reporting. Your contribution helps keep our city clean.
          </Text>
          <Button
            title="Continue"
            onPress={onClose}
            size="large"
            style={styles.button}
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  container: {
    backgroundColor: COLORS.background,
    borderRadius: normalize(16),
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  iconContainer: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZES.md * 1.5,
    marginBottom: SPACING.xl,
  },
  button: {
    width: '100%',
  },
});
