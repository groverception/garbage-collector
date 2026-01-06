import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { AnimatedTitle } from '@/src/components/landing/AnimatedTitle';
import { Button } from '@/src/components/common/Button';
import { COLORS } from '@/src/constants/colors';
import { SPACING, FONT_SIZES, normalize, getContentWidth } from '@/src/utils/responsive';

export default function HomeScreen() {
  const handleUpload = () => {
    router.push('/(tabs)/upload');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <FontAwesome name="recycle" size={normalize(60)} color={COLORS.primary} />
            </View>
            <AnimatedTitle />
            <Text style={styles.tagline}>
              Help keep our city clean by reporting garbage in public spaces
            </Text>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <FontAwesome name="camera" size={24} color={COLORS.primary} />
              <Text style={styles.statLabel}>Snap a photo</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome name="map-marker" size={24} color={COLORS.primary} />
              <Text style={styles.statLabel}>Share location</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome name="check-circle" size={24} color={COLORS.primary} />
              <Text style={styles.statLabel}>Make an impact</Text>
            </View>
          </View>

          <Button
            title="Report Garbage"
            onPress={handleUpload}
            size="large"
            style={styles.button}
          />

          <Text style={styles.footerText}>
            Every report helps municipal workers prioritize cleanup efforts
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    maxWidth: getContentWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  iconContainer: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZES.md * 1.6,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 300,
    marginBottom: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
