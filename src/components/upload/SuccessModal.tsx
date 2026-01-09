import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, normalize } from '../../utils/responsive';
import { RippleButton, SuccessConfetti } from '../common';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SuccessModal({ visible, onClose }: SuccessModalProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (visible) {
      opacity.value = withSpring(1);
      scale.value = withSpring(1, { damping: 20, stiffness: 200 });
      checkScale.value = withDelay(200, withSpring(1, { damping: 18, stiffness: 200 }));

      // Trigger confetti after modal appears
      setTimeout(() => setShowConfetti(true), 300);
    } else {
      opacity.value = 0;
      scale.value = 0;
      checkScale.value = 0;
      setShowConfetti(false);
    }
  }, [visible]);

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
          <RippleButton
            title="Continue"
            onPress={onClose}
            variant="primary"
            fullWidth
            style={styles.button}
          />
        </Animated.View>

        {/* Confetti celebration */}
        <SuccessConfetti
          active={showConfetti}
          onComplete={() => setShowConfetti(false)}
        />
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
