import React from 'react';
import { View, Text, Image, StyleSheet, Platform, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, normalize } from '../../utils/responsive';

export interface CompletedTask {
  id: string;
  imageUri: string;
  location: string;
  area: string;
  reportedBy: string;
  completedAt: string;
  impactScore: number;
  cleanupTeam: string;
  beforeAfterAvailable: boolean;
  likes: number;
  daysToResolve: number;
}

interface CompletedTaskCardProps {
  task: CompletedTask;
  onPress?: () => void;
}

export function CompletedTaskCard({ task, onPress }: CompletedTaskCardProps) {
  const formattedDate = new Date(task.completedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  const getImpactColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#8BC34A';
    if (score >= 50) return '#FF9800';
    return '#F44336';
  };

  const getImpactLabel = (score: number) => {
    if (score >= 90) return 'High Impact';
    if (score >= 70) return 'Good Impact';
    if (score >= 50) return 'Moderate';
    return 'Low';
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: task.imageUri }} style={styles.image} />
        <View style={styles.completedBadge}>
          <FontAwesome name="check" size={10} color={COLORS.textLight} />
          <Text style={styles.completedText}>Cleaned</Text>
        </View>
        {task.beforeAfterAvailable && (
          <View style={styles.beforeAfterBadge}>
            <FontAwesome name="exchange" size={8} color={COLORS.textLight} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.locationInfo}>
            <Text style={styles.location} numberOfLines={1}>
              {task.location}
            </Text>
            <Text style={styles.area} numberOfLines={1}>
              {task.area}
            </Text>
          </View>
          <View style={[styles.impactBadge, { backgroundColor: getImpactColor(task.impactScore) }]}>
            <Text style={styles.impactScore}>{task.impactScore}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <FontAwesome name="users" size={12} color={COLORS.primary} />
            <Text style={styles.statText}>{task.cleanupTeam}</Text>
          </View>
          <View style={styles.stat}>
            <FontAwesome name="clock-o" size={12} color={COLORS.secondary} />
            <Text style={styles.statText}>{task.daysToResolve}d to fix</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.reporterInfo}>
            <FontAwesome name="user-circle-o" size={14} color={COLORS.textMuted} />
            <Text style={styles.reporterText}>by {task.reportedBy}</Text>
          </View>
          <View style={styles.engagement}>
            <View style={styles.likeButton}>
              <FontAwesome name="heart" size={12} color="#E91E63" />
              <Text style={styles.likeCount}>{task.likes}</Text>
            </View>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: normalize(16),
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 12px rgba(76, 175, 80, 0.15)',
      },
    }),
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    position: 'relative',
    height: normalize(140),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  completedBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  beforeAfterBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.accent,
    padding: 6,
    borderRadius: 12,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  locationInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  location: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  area: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  impactBadge: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactScore: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reporterText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  engagement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: FONT_SIZES.xs,
    color: '#E91E63',
    fontWeight: '600',
  },
  dateText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
});
