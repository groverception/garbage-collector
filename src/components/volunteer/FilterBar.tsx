import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, normalize } from '../../utils/responsive';
import { CITIES, STATUS_OPTIONS, VOLUNTEER_STATUS_CONFIG } from '../../constants/volunteerData';
import type { VolunteerFilterOptions, TaskScope, VolunteerTaskStatus } from '../../types/volunteer';

interface FilterBarProps {
  filters: VolunteerFilterOptions;
  onFilterChange: (filters: VolunteerFilterOptions) => void;
  taskCounts: {
    all: number;
    open: number;
    in_progress: number;
    resolved: number;
    verified: number;
  };
}

export function FilterBar({ filters, onFilterChange, taskCounts }: FilterBarProps) {
  const toggleScope = () => {
    const newScope: TaskScope = filters.scope === 'global' ? 'local' : 'global';
    onFilterChange({
      ...filters,
      scope: newScope,
      city: newScope === 'local' ? (filters.city || CITIES[1]) : undefined,
    });
  };

  const handleStatusChange = (status: VolunteerTaskStatus | 'all') => {
    onFilterChange({
      ...filters,
      status,
    });
  };

  const handleCityChange = (city: string) => {
    onFilterChange({
      ...filters,
      city: city === 'All Cities' ? undefined : city,
    });
  };

  return (
    <View style={styles.container}>
      {/* Scope Toggle */}
      <View style={styles.scopeRow}>
        <TouchableOpacity
          style={[
            styles.scopeButton,
            filters.scope === 'global' && styles.scopeButtonActive,
          ]}
          onPress={() => filters.scope !== 'global' && toggleScope()}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="globe"
            size={14}
            color={filters.scope === 'global' ? COLORS.textLight : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.scopeText,
              filters.scope === 'global' && styles.scopeTextActive,
            ]}
          >
            Global
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.scopeButton,
            filters.scope === 'local' && styles.scopeButtonActive,
          ]}
          onPress={() => filters.scope !== 'local' && toggleScope()}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="map-marker"
            size={14}
            color={filters.scope === 'local' ? COLORS.textLight : COLORS.textSecondary}
          />
          <Text
            style={[
              styles.scopeText,
              filters.scope === 'local' && styles.scopeTextActive,
            ]}
          >
            Local
          </Text>
        </TouchableOpacity>
      </View>

      {/* City Filter (only when local) */}
      {filters.scope === 'local' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cityScroll}
          contentContainerStyle={styles.cityScrollContent}
        >
          {CITIES.map((city) => {
            const isSelected =
              (city === 'All Cities' && !filters.city) || filters.city === city;
            return (
              <TouchableOpacity
                key={city}
                style={[styles.cityChip, isSelected && styles.cityChipActive]}
                onPress={() => handleCityChange(city)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.cityChipText,
                    isSelected && styles.cityChipTextActive,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusScroll}
        contentContainerStyle={styles.statusScrollContent}
      >
        {STATUS_OPTIONS.map((option) => {
          const isSelected = filters.status === option.value;
          const count = taskCounts[option.value as keyof typeof taskCounts] || 0;
          const statusColor =
            option.value !== 'all'
              ? VOLUNTEER_STATUS_CONFIG[option.value as VolunteerTaskStatus].color
              : COLORS.primary;

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusChip,
                isSelected && [styles.statusChipActive, { borderColor: statusColor }],
              ]}
              onPress={() => handleStatusChange(option.value as VolunteerTaskStatus | 'all')}
              activeOpacity={0.7}
            >
              {option.value !== 'all' && (
                <FontAwesome
                  name={VOLUNTEER_STATUS_CONFIG[option.value as VolunteerTaskStatus].icon as any}
                  size={12}
                  color={isSelected ? statusColor : COLORS.textMuted}
                  style={styles.statusIcon}
                />
              )}
              <Text
                style={[
                  styles.statusChipText,
                  isSelected && { color: statusColor },
                ]}
              >
                {option.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  isSelected && { backgroundColor: statusColor },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    isSelected && styles.countTextActive,
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      },
    }),
  },
  scopeRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  scopeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: normalize(20),
    backgroundColor: COLORS.backgroundSecondary,
    gap: 6,
  },
  scopeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  scopeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  scopeTextActive: {
    color: COLORS.textLight,
  },
  cityScroll: {
    marginBottom: SPACING.sm,
  },
  cityScrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  cityChip: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: normalize(16),
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cityChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  cityChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  cityChipTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  statusScroll: {},
  statusScrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: normalize(16),
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 4,
  },
  statusChipActive: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
  },
  statusIcon: {
    marginRight: 2,
  },
  statusChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  countBadge: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 2,
  },
  countText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  countTextActive: {
    color: COLORS.textLight,
  },
});
