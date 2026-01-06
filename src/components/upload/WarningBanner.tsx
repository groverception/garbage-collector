import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, normalize } from '../../utils/responsive';

export function WarningBanner() {
  return (
    <View style={styles.container}>
      <FontAwesome name="warning" size={18} color={COLORS.warning} />
      <Text style={styles.text}>
        AI generated photos will be neglected by the system
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.warning,
    gap: SPACING.sm,
  },
  text: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondaryDark,
    fontWeight: '500',
  },
});
