import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { AnimatedTitle } from '@/src/components/landing/AnimatedTitle';
import { Button } from '@/src/components/common/Button';
import { CompletedTaskCard } from '@/src/components/home/CompletedTaskCard';
import { COLORS } from '@/src/constants/colors';
import { SPACING, FONT_SIZES, normalize, getContentWidth } from '@/src/utils/responsive';
import { COMPLETED_TASKS, IMPACT_STATS } from '@/src/data/completedTasks';

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

          {/* Impact Statistics Section */}
          <View style={styles.impactSection}>
            <View style={styles.sectionHeader}>
              <FontAwesome name="bar-chart" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Community Impact</Text>
            </View>
            <View style={styles.impactGrid}>
              <View style={styles.impactCard}>
                <Text style={styles.impactNumber}>{IMPACT_STATS.totalReports.toLocaleString()}</Text>
                <Text style={styles.impactLabel}>Reports Filed</Text>
              </View>
              <View style={styles.impactCard}>
                <Text style={[styles.impactNumber, { color: COLORS.success }]}>{IMPACT_STATS.resolvedThisWeek}</Text>
                <Text style={styles.impactLabel}>Resolved This Week</Text>
              </View>
              <View style={styles.impactCard}>
                <Text style={[styles.impactNumber, { color: COLORS.secondary }]}>{IMPACT_STATS.activeVolunteers}</Text>
                <Text style={styles.impactLabel}>Active Volunteers</Text>
              </View>
              <View style={styles.impactCard}>
                <Text style={[styles.impactNumber, { color: COLORS.accent }]}>{IMPACT_STATS.citiesCovered}</Text>
                <Text style={styles.impactLabel}>Cities Covered</Text>
              </View>
            </View>
          </View>

          {/* Completed Tasks Section */}
          <View style={styles.completedSection}>
            <View style={styles.sectionHeader}>
              <FontAwesome name="check-circle" size={20} color={COLORS.success} />
              <Text style={styles.sectionTitle}>Recent Success Stories</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              See how your reports are making a difference across India
            </Text>

            <View style={styles.tasksList}>
              {COMPLETED_TASKS.slice(0, 5).map((task) => (
                <CompletedTaskCard key={task.id} task={task} />
              ))}
            </View>

            <Button
              title="View All Success Stories"
              onPress={() => router.push('/(tabs)/history')}
              variant="outline"
              style={styles.viewAllButton}
            />
          </View>
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
  // Impact Statistics Section
  impactSection: {
    width: '100%',
    marginTop: SPACING.xxl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  impactCard: {
    width: '48%',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: normalize(12),
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  impactNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  impactLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Completed Tasks Section
  completedSection: {
    width: '100%',
    marginTop: SPACING.xxl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  tasksList: {
    width: '100%',
  },
  viewAllButton: {
    marginTop: SPACING.md,
  },
});
