// Volunteer task status - workflow from reported to verified
export type VolunteerTaskStatus =
  | 'open'           // Task is open for volunteers
  | 'in_progress'    // Someone is working on it
  | 'resolved'       // Volunteer marked as done, pending verification
  | 'verified';      // Verified by another user as fixed

// Scope filter for tasks
export type TaskScope = 'global' | 'local';

// Comment on a volunteer task
export interface TaskComment {
  id: number;
  taskId: number;
  userName: string;
  comment: string;
  createdAt: string;
}

// Status update history
export interface StatusUpdate {
  id: number;
  taskId: number;
  previousStatus: VolunteerTaskStatus;
  newStatus: VolunteerTaskStatus;
  userName: string;
  comment: string; // Mandatory comment explaining the status change
  createdAt: string;
}

// Main volunteer task interface
export interface VolunteerTask {
  id: number;
  // Original report data
  imageUri: string;
  thumbnailUri: string | null;
  location: string;
  concern: string;
  reportedBy: string;
  reportedAt: string;
  // Volunteer tracking
  status: VolunteerTaskStatus;
  assignedTo: string | null;
  assignedAt: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  // Comments and updates
  comments: TaskComment[];
  statusHistory: StatusUpdate[];
  // Location scope (for filtering)
  city: string;
  area: string;
}

// Input for volunteering for a task
export interface VolunteerInput {
  taskId: number;
  userName: string;
  comment: string;
}

// Input for updating task status
export interface StatusUpdateInput {
  taskId: number;
  newStatus: VolunteerTaskStatus;
  userName: string;
  comment: string; // Mandatory
}

// Input for adding a comment
export interface AddCommentInput {
  taskId: number;
  userName: string;
  comment: string;
}

// Filter options for the volunteer list
export interface VolunteerFilterOptions {
  scope: TaskScope;
  status: VolunteerTaskStatus | 'all';
  city?: string;
}
