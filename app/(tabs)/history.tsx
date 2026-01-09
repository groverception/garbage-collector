import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { HistoryCard } from '@/src/components/history/HistoryCard';
import { EmptyState } from '@/src/components/history/EmptyState';
import { CardSkeleton } from '@/src/components/common';
import { useUploads } from '@/src/hooks/useUploads';
import { COLORS } from '@/src/constants/colors';
import { SPACING, getContentWidth } from '@/src/utils/responsive';
import type { Upload } from '@/src/types/upload';

export default function HistoryScreen() {
  const { uploads, isLoading, reload } = useUploads();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const renderItem = useCallback(
    ({ item }: { item: Upload }) => <HistoryCard upload={item} />,
    []
  );

  const keyExtractor = useCallback((item: Upload) => item.id.toString(), []);

  if (isLoading && uploads.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.listContent}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={uploads}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          uploads.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={reload}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="camera"
            title="No reports yet"
            message="Start making a difference by reporting garbage in your area"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  listContent: {
    padding: SPACING.md,
    maxWidth: getContentWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  emptyListContent: {
    flex: 1,
  },
});
