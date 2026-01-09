import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { AnimatedTitle } from '@/src/components/landing/AnimatedTitle';
import { Button } from '@/src/components/common/Button';
import { CompletedTaskCard } from '@/src/components/home/CompletedTaskCard';
import { COLORS } from '@/src/constants/colors';
import { SPACING, FONT_SIZES, normalize, getContentWidth } from '@/src/utils/responsive';
import { COMPLETED_TASKS, IMPACT_STATS } from '@/src/data/completedTasks';
import { MorphingBlob } from '@/src/components/common/MorphingBlob';
import { GeometricPattern } from '@/src/components/common/GeometricPattern';
import { FloatingParticles } from '@/src/components/common/FloatingParticles';
import { usePulseAnimation } from '@/src/hooks/useContinuousAnimation';
import { useAnimatedEntrance } from '@/src/hooks/useAnimatedEntrance';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function HomeScreen() {
  const scrollY = useSharedValue(0);
  const iconPulse = usePulseAnimation({ scale: 1.05, duration: 2000 });
  const heroEntrance = useAnimatedEntrance({ type: 'bounce', delay: 200 });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleUpload = () => {
    router.push('/(tabs)/upload');
  };

  // Parallax effect for hero section
  const heroAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 300],
      [0, -50],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [0, 300],
      [1, 0.9],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  // Fade effect for tagline
  const taglineAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 150],
      [1, 0],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  // Animated icon container
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconPulse.value }],
      opacity: heroEntrance.opacity.value,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Background Layers */}
      <View style={styles.backgroundContainer}>
        <GeometricPattern variant="circles" opacity={0.08} />
        <MorphingBlob
          size={500}
          colors={[COLORS.primary, COLORS.primaryLight]}
          duration={8000}
          opacity={0.12}
          style={{ top: -150, right: -150 }}
        />
        <MorphingBlob
          size={400}
          colors={[COLORS.accent, COLORS.secondary]}
          duration={10000}
          opacity={0.08}
          style={{ bottom: 100, left: -100 }}
        />
        <FloatingParticles
          count={10}
          icons={['leaf', 'recycle', 'flower', 'sprout']}
          colors={[COLORS.primary, COLORS.accent, COLORS.success]}
        />
      </View>

      <AnimatedScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.heroSection, heroAnimatedStyle]}>
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <FontAwesome name="recycle" size={normalize(60)} color={COLORS.primary} />
            </Animated.View>
            <AnimatedTitle />
            <Animated.Text style={[styles.tagline, taglineAnimatedStyle]}>
              Help keep our city clean by reporting garbage in public spaces
            </Animated.Text>
          </Animated.View>

          <View style={styles.statsSection}>
            <StatsItem icon="camera" label="Snap a photo" delay={0} />
            <StatsItem icon="map-marker" label="Share location" delay={100} />
            <StatsItem icon="check-circle" label="Make an impact" delay={200} />
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
              <ImpactCard
                number={IMPACT_STATS.totalReports.toLocaleString()}
                label="Reports Filed"
                color={COLORS.primary}
                delay={0}
              />
              <ImpactCard
                number={IMPACT_STATS.resolvedThisWeek}
                label="Resolved This Week"
                color={COLORS.success}
                delay={100}
              />
              <ImpactCard
                number={IMPACT_STATS.activeVolunteers}
                label="Active Volunteers"
                color={COLORS.secondary}
                delay={200}
              />
              <ImpactCard
                number={IMPACT_STATS.citiesCovered}
                label="Cities Covered"
                color={COLORS.accent}
                delay={300}
              />
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
              {COMPLETED_TASKS.slice(0, 5).map((task, index) => (
                <AnimatedTaskCard key={task.id} task={task} index={index} />
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
      </AnimatedScrollView>
    </SafeAreaView>
  );
}

// Animated Stats Item Component
function StatsItem({ icon, label, delay }: { icon: string; label: string; delay: number }) {
  const entrance = useAnimatedEntrance({ type: 'slideUp', delay: 400 + delay });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: entrance.opacity.value,
      transform: [{ translateY: entrance.translateY.value }],
    };
  });

  return (
    <Animated.View style={[styles.statItem, animatedStyle]}>
      <FontAwesome name={icon as any} size={24} color={COLORS.primary} />
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

// Animated Impact Card Component
function ImpactCard({
  number,
  label,
  color,
  delay,
}: {
  number: string | number;
  label: string;
  color: string;
  delay: number;
}) {
  const entrance = useAnimatedEntrance({ type: 'scale', delay: 600 + delay });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: entrance.opacity.value,
      transform: [{ scale: entrance.scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.impactCard, animatedStyle]}>
      <Text style={[styles.impactNumber, { color }]}>{number}</Text>
      <Text style={styles.impactLabel}>{label}</Text>
    </Animated.View>
  );
}

// Animated Task Card Wrapper
function AnimatedTaskCard({ task, index }: { task: any; index: number }) {
  const entrance = useAnimatedEntrance({ type: 'slideUp', delay: 800 + index * 100 });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: entrance.opacity.value,
      transform: [{ translateY: entrance.translateY.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <CompletedTaskCard task={task} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
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
