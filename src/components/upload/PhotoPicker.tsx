import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, normalize, hp } from '../../utils/responsive';

interface PhotoPickerProps {
  imageUri: string | null;
  onPress: () => void;
  isLoading?: boolean;
}

export function PhotoPicker({ imageUri, onPress, isLoading }: PhotoPickerProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {imageUri ? (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.changeOverlay}>
            <FontAwesome name="camera" size={24} color={COLORS.textLight} />
            <Text style={styles.changeText}>Change Photo</Text>
          </View>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <View style={styles.iconContainer}>
            <FontAwesome name="camera" size={normalize(40)} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Upload Photo</Text>
          <Text style={styles.subtitle}>Take a photo or select from gallery</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: hp(30),
    minHeight: 200,
    borderRadius: normalize(12),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    backgroundColor: COLORS.backgroundSecondary,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  iconContainer: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.overlay,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  changeText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
});
