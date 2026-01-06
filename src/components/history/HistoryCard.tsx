import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, normalize } from '../../utils/responsive';
import type { Upload, UploadStatus } from '../../types/upload';

interface HistoryCardProps {
  upload: Upload;
}

const STATUS_CONFIG: Record<UploadStatus, { color: string; label: string; icon: string }> = {
  pending: { color: COLORS.warning, label: 'Pending', icon: 'clock-o' },
  uploaded: { color: COLORS.info, label: 'Uploaded', icon: 'cloud-upload' },
  reviewed: { color: COLORS.success, label: 'Reviewed', icon: 'check-circle' },
  rejected: { color: COLORS.error, label: 'Rejected', icon: 'times-circle' },
};

export function HistoryCard({ upload }: HistoryCardProps) {
  const statusConfig = STATUS_CONFIG[upload.status];
  const formattedDate = new Date(upload.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: upload.imageUri }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.location} numberOfLines={1}>
            {upload.location}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
            <FontAwesome name={statusConfig.icon as any} size={10} color={COLORS.textLight} />
            <Text style={styles.statusText}>{statusConfig.label}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={1}>
          {upload.description}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </View>
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
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
    }),
  },
  image: {
    width: normalize(100),
    height: normalize(100),
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
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    gap: 4,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  date: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
});
