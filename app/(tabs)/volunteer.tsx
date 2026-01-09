import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { VolunteerCard, VolunteerDetailModal, FilterBar } from '@/src/components/volunteer';
import { EmptyState } from '@/src/components/history/EmptyState';
import { PullToRefresh } from '@/src/components/common';
import { useVolunteer } from '@/src/hooks/useVolunteer';
import { useAppContext } from '@/src/context/AppContext';
import { COLORS } from '@/src/constants/colors';
import { SPACING, FONT_SIZES, getContentWidth } from '@/src/utils/responsive';
import type { VolunteerTask, VolunteerTaskStatus } from '@/src/types/volunteer';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<VolunteerTask>);

export default function VolunteerScreen() {
  const { userName } = useAppContext();
  const {
    tasks,
    filteredTasks,
    isLoading,
    filters,
    setFilters,
    volunteerForTask,
    updateTaskStatus,
    addComment,
    verifyTask,
    reload,
  } = useVolunteer();

  const [selectedTask, setSelectedTask] = useState<VolunteerTask | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Reload on focus
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  // Calculate task counts for filter bar
  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      open: tasks.filter((t) => t.status === 'open').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      resolved: tasks.filter((t) => t.status === 'resolved').length,
      verified: tasks.filter((t) => t.status === 'verified').length,
    };
  }, [tasks]);

  const handleCardPress = useCallback((task: VolunteerTask) => {
    setSelectedTask(task);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedTask(null);
  }, []);

  const handleVolunteer = useCallback(
    async (taskId: number, user: string, comment: string) => {
      const success = await volunteerForTask({
        taskId,
        userName: user,
        comment,
      });
      if (success) {
        // Update selected task to reflect changes
        const updatedTask = tasks.find((t) => t.id === taskId);
        if (updatedTask) {
          setSelectedTask({ ...updatedTask });
        }
      }
      return success;
    },
    [volunteerForTask, tasks]
  );

  const handleUpdateStatus = useCallback(
    async (
      taskId: number,
      newStatus: VolunteerTaskStatus,
      user: string,
      comment: string
    ) => {
      const success = await updateTaskStatus({
        taskId,
        newStatus,
        userName: user,
        comment,
      });
      if (success) {
        const updatedTask = tasks.find((t) => t.id === taskId);
        if (updatedTask) {
          setSelectedTask({ ...updatedTask });
        }
      }
      return success;
    },
    [updateTaskStatus, tasks]
  );

  const handleAddComment = useCallback(
    async (taskId: number, user: string, comment: string) => {
      const success = await addComment({
        taskId,
        userName: user,
        comment,
      });
      if (success) {
        const updatedTask = tasks.find((t) => t.id === taskId);
        if (updatedTask) {
          setSelectedTask({ ...updatedTask });
        }
      }
      return success;
    },
    [addComment, tasks]
  );

  const handleVerify = useCallback(
    async (taskId: number, user: string, comment: string) => {
      const success = await verifyTask(taskId, user, comment);
      if (success) {
        const updatedTask = tasks.find((t) => t.id === taskId);
        if (updatedTask) {
          setSelectedTask({ ...updatedTask });
        }
      }
      return success;
    },
    [verifyTask, tasks]
  );

  const renderItem = useCallback(
    ({ item }: { item: VolunteerTask }) => (
      <VolunteerCard task={item} onPress={() => handleCardPress(item)} />
    ),
    [handleCardPress]
  );

  const keyExtractor = useCallback((item: VolunteerTask) => item.id.toString(), []);

  const currentUserName = userName || 'Anonymous User';

  // Loading state
  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        taskCounts={taskCounts}
      />

      {/* Summary Text */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Showing {filteredTasks.length} of {tasks.length} tasks
        </Text>
      </View>

      <PullToRefresh
        onRefresh={reload}
        refreshing={isLoading}
        threshold={80}
      >
        <AnimatedFlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.listContent,
            filteredTasks.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <EmptyState
              icon="hand-paper-o"
              title="No tasks found"
              message={
                filters.status !== 'all'
                  ? `No ${filters.status.replace('_', ' ')} tasks available. Try changing the filter.`
                  : 'No volunteer tasks available at the moment. Check back later!'
              }
            />
          }
        />
      </PullToRefresh>

      <VolunteerDetailModal
        visible={modalVisible}
        task={selectedTask}
        currentUserName={currentUserName}
        onClose={handleCloseModal}
        onVolunteer={handleVolunteer}
        onUpdateStatus={handleUpdateStatus}
        onAddComment={handleAddComment}
        onVerify={handleVerify}
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
  summaryContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.backgroundSecondary,
  },
  summaryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
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
