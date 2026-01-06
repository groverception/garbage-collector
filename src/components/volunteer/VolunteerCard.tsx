import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, normalize } from '../../utils/responsive';
import { CONCERN_OPTIONS } from '../../constants/concerns';
import { VOLUNTEER_STATUS_CONFIG } from '../../constants/volunteerData';
import type { VolunteerTask } from '../../types/volunteer';

interface VolunteerCardProps {
  task: VolunteerTask;
  onPress: () => void;
}

export function VolunteerCard({ task, onPress }: VolunteerCardProps) {
  const statusConfig = VOLUNTEER_STATUS_CONFIG[task.status];
  const concernLabel =
    CONCERN_OPTIONS.find((c) => c.value === task.concern)?.label || task.concern;

  const formattedDate = new Date(task.reportedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const commentsCount = task.comments.length;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: task.imageUri }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.location} numberOfLines={1}>
            {task.location}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
            <FontAwesome
              name={statusConfig.icon as any}
              size={10}
              color={COLORS.textLight}
            />
            <Text style={styles.statusText}>{statusConfig.label}</Text>
          </View>
        </View>

        <Text style={styles.concern} numberOfLines={1}>
          {concernLabel}
        </Text>

        <View style={styles.footer}>
          <View style={styles.meta}>
            <FontAwesome
              name="user"
              size={10}
              color={COLORS.textMuted}
              style={styles.metaIcon}
            />
            <Text style={styles.metaText}>{task.reportedBy}</Text>
          </View>
          <View style={styles.meta}>
            <FontAwesome
              name="calendar"
              size={10}
              color={COLORS.textMuted}
              style={styles.metaIcon}
            />
            <Text style={styles.metaText}>{formattedDate}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <FontAwesome
              name="comment"
              size={12}
              color={COLORS.textSecondary}
            />
            <Text style={styles.statText}>{commentsCount}</Text>
          </View>
          {task.assignedTo && (
            <View style={styles.assignedBadge}>
              <FontAwesome
                name="hand-paper-o"
                size={10}
                color={COLORS.primary}
              />
              <Text style={styles.assignedText} numberOfLines={1}>
                {task.assignedTo}
              </Text>
            </View>
          )}
          {task.status === 'open' && (
            <View style={styles.volunteerPrompt}>
              <FontAwesome name="arrow-right" size={12} color={COLORS.primary} />
              <Text style={styles.volunteerText}>Tap to volunteer</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: normalize(12),
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  image: {
    width: normalize(110),
    height: normalize(130),
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  location: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    gap: 4,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  concern: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    gap: 4,
    flex: 1,
  },
  assignedText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
    flex: 1,
  },
  volunteerPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  volunteerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
