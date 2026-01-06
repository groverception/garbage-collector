import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, normalize, getContentWidth } from '../../utils/responsive';
import { CONCERN_OPTIONS } from '../../constants/concerns';
import { VOLUNTEER_STATUS_CONFIG } from '../../constants/volunteerData';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Dropdown } from '../common/Dropdown';
import type { VolunteerTask, VolunteerTaskStatus } from '../../types/volunteer';

interface VolunteerDetailModalProps {
  visible: boolean;
  task: VolunteerTask | null;
  currentUserName: string;
  onClose: () => void;
  onVolunteer: (taskId: number, userName: string, comment: string) => Promise<boolean>;
  onUpdateStatus: (
    taskId: number,
    newStatus: VolunteerTaskStatus,
    userName: string,
    comment: string
  ) => Promise<boolean>;
  onAddComment: (taskId: number, userName: string, comment: string) => Promise<boolean>;
  onVerify: (taskId: number, userName: string, comment: string) => Promise<boolean>;
}

export function VolunteerDetailModal({
  visible,
  task,
  currentUserName,
  onClose,
  onVolunteer,
  onUpdateStatus,
  onAddComment,
  onVerify,
}: VolunteerDetailModalProps) {
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState<VolunteerTaskStatus | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [error, setError] = useState('');

  if (!task) return null;

  const statusConfig = VOLUNTEER_STATUS_CONFIG[task.status];
  const concernLabel =
    CONCERN_OPTIONS.find((c) => c.value === task.concern)?.label || task.concern;

  const formattedReportDate = new Date(task.reportedAt).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isAssignedToMe = task.assignedTo === currentUserName;
  const isResolved = task.status === 'resolved';
  const isVerified = task.status === 'verified';
  const isClosed = isResolved || isVerified;
  const canVolunteer = task.status === 'open';
  const canUpdateStatus = isAssignedToMe && task.status === 'in_progress';
  const canVerify = isResolved && task.resolvedBy !== currentUserName;

  const resetForm = () => {
    setComment('');
    setNewStatus('');
    setShowStatusForm(false);
    setError('');
  };

  const handleVolunteer = async () => {
    if (!comment.trim()) {
      setError('Please add a comment explaining how you plan to help');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const success = await onVolunteer(task.id, currentUserName, comment.trim());

    setIsSubmitting(false);
    if (success) {
      resetForm();
      onClose();
      showAlert('Success', 'Thank you for volunteering! Your help makes a difference.');
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      setError('Please select a new status');
      return;
    }
    if (!comment.trim()) {
      setError('Please add a mandatory comment detailing the status');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const success = await onUpdateStatus(
      task.id,
      newStatus as VolunteerTaskStatus,
      currentUserName,
      comment.trim()
    );

    setIsSubmitting(false);
    if (success) {
      resetForm();
      showAlert('Success', 'Task status updated successfully.');
    }
  };

  const handleVerify = async () => {
    if (!comment.trim()) {
      setError('Please add a comment confirming the resolution');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const success = await onVerify(task.id, currentUserName, comment.trim());

    setIsSubmitting(false);
    if (success) {
      resetForm();
      showAlert('Success', 'Task verified as fixed. Thank you for confirming!');
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const success = await onAddComment(task.id, currentUserName, comment.trim());

    setIsSubmitting(false);
    if (success) {
      setComment('');
      setError('');
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const getStatusUpdateOptions = () => {
    // Available transitions based on current status
    if (task.status === 'in_progress') {
      return [
        { label: 'Mark as Resolved', value: 'resolved' },
        { label: 'Back to Open', value: 'open' },
      ];
    }
    return [];
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Task Details</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <FontAwesome name="times" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Image */}
              <Image source={{ uri: task.imageUri }} style={styles.image} />

              {/* Status Badge */}
              <View style={styles.statusRow}>
                <View
                  style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}
                >
                  <FontAwesome
                    name={statusConfig.icon as any}
                    size={14}
                    color={COLORS.textLight}
                  />
                  <Text style={styles.statusText}>{statusConfig.label}</Text>
                </View>
                <Text style={styles.statusDescription}>{statusConfig.description}</Text>
              </View>

              {/* Location & Details */}
              <View style={styles.section}>
                <Text style={styles.location}>{task.location}</Text>
                <Text style={styles.concern}>{concernLabel}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Reported by:</Text>
                  <Text style={styles.metaValue}>{task.reportedBy}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Date:</Text>
                  <Text style={styles.metaValue}>{formattedReportDate}</Text>
                </View>
                {task.assignedTo && (
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Assigned to:</Text>
                    <Text style={[styles.metaValue, styles.assignedValue]}>
                      {task.assignedTo}
                    </Text>
                  </View>
                )}
              </View>

              {/* Comments Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Comments ({task.comments.length})
                </Text>
                {task.comments.map((c) => (
                  <View key={c.id} style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUser}>{c.userName}</Text>
                      <Text style={styles.commentDate}>
                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{c.comment}</Text>
                  </View>
                ))}
              </View>

              {/* Status History */}
              {task.statusHistory.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Status History</Text>
                  {task.statusHistory.map((update) => (
                    <View key={update.id} style={styles.historyItem}>
                      <View style={styles.historyIcon}>
                        <FontAwesome
                          name="arrow-right"
                          size={10}
                          color={COLORS.textMuted}
                        />
                      </View>
                      <View style={styles.historyContent}>
                        <Text style={styles.historyText}>
                          <Text style={styles.historyUser}>{update.userName}</Text>
                          {' changed status to '}
                          <Text style={styles.historyStatus}>
                            {VOLUNTEER_STATUS_CONFIG[update.newStatus].label}
                          </Text>
                        </Text>
                        <Text style={styles.historyComment}>{update.comment}</Text>
                        <Text style={styles.historyDate}>
                          {new Date(update.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Action Section */}
              <View style={styles.actionSection}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Volunteer Action */}
                {canVolunteer && (
                  <View style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Volunteer for this task</Text>
                    <Text style={styles.actionDescription}>
                      Help clean up this area by volunteering
                    </Text>
                    <Input
                      label="How will you help? (required)"
                      placeholder="Describe your plan..."
                      value={comment}
                      onChangeText={setComment}
                      multiline
                      numberOfLines={3}
                      style={styles.textArea}
                    />
                    <Button
                      title="Volunteer Now"
                      onPress={handleVolunteer}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    />
                  </View>
                )}

                {/* Status Update Action */}
                {canUpdateStatus && (
                  <View style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Update Status</Text>
                    {!showStatusForm ? (
                      <Button
                        title="Update Task Status"
                        onPress={() => setShowStatusForm(true)}
                        variant="outline"
                      />
                    ) : (
                      <>
                        <Dropdown
                          label="New Status"
                          placeholder="Select new status"
                          options={getStatusUpdateOptions()}
                          value={newStatus}
                          onChange={(val) => setNewStatus(val as VolunteerTaskStatus)}
                        />
                        <Input
                          label="Status Comment (required)"
                          placeholder="Explain the current status in detail..."
                          value={comment}
                          onChangeText={setComment}
                          multiline
                          numberOfLines={3}
                          style={styles.textArea}
                        />
                        <View style={styles.buttonRow}>
                          <Button
                            title="Cancel"
                            onPress={() => {
                              setShowStatusForm(false);
                              setNewStatus('');
                              setComment('');
                            }}
                            variant="outline"
                            style={styles.flexButton}
                          />
                          <Button
                            title="Update"
                            onPress={handleStatusUpdate}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            style={styles.flexButton}
                          />
                        </View>
                      </>
                    )}
                  </View>
                )}

                {/* Verify Action */}
                {canVerify && (
                  <View style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Verify Resolution</Text>
                    <Text style={styles.actionDescription}>
                      Visit the location and confirm if the issue has been resolved
                    </Text>
                    <Input
                      label="Verification Comment (required)"
                      placeholder="Confirm the cleanup is complete..."
                      value={comment}
                      onChangeText={setComment}
                      multiline
                      numberOfLines={3}
                      style={styles.textArea}
                    />
                    <Button
                      title="Verify as Fixed"
                      onPress={handleVerify}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    />
                  </View>
                )}

                {/* Add Comment (visible for in_progress tasks only) */}
                {!canVolunteer && !canVerify && !isClosed && (
                  <View style={styles.actionCard}>
                    <Text style={styles.actionTitle}>Add Comment</Text>
                    <Input
                      placeholder="Add your comment..."
                      value={comment}
                      onChangeText={setComment}
                      multiline
                      numberOfLines={2}
                      style={styles.textArea}
                    />
                    <Button
                      title="Post Comment"
                      onPress={handleAddComment}
                      loading={isSubmitting}
                      disabled={isSubmitting || !comment.trim()}
                      variant="outline"
                    />
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '95%',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      },
    }),
  },
  modalContent: {
    maxWidth: getContentWidth(),
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  scrollView: {
    maxHeight: 600,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  image: {
    width: '100%',
    height: normalize(200),
    borderRadius: normalize(12),
    marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  location: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  concern: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  metaLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    width: 100,
  },
  metaValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    flex: 1,
  },
  assignedValue: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  commentCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: normalize(8),
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  commentUser: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  commentDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  commentText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZES.sm * 1.4,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  historyIcon: {
    width: 20,
    alignItems: 'center',
    paddingTop: 4,
  },
  historyContent: {
    flex: 1,
  },
  historyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  historyUser: {
    fontWeight: '600',
    color: COLORS.text,
  },
  historyStatus: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  historyComment: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  historyDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  actionSection: {
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: normalize(12),
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  actionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  actionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  flexButton: {
    flex: 1,
  },
});
