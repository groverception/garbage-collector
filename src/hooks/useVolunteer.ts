import { useState, useCallback } from 'react';
import { DUMMY_VOLUNTEER_TASKS } from '../constants/volunteerData';
import type {
  VolunteerTask,
  VolunteerTaskStatus,
  TaskScope,
  VolunteerFilterOptions,
  VolunteerInput,
  StatusUpdateInput,
  AddCommentInput,
  TaskComment,
  StatusUpdate,
} from '../types/volunteer';

interface UseVolunteerReturn {
  tasks: VolunteerTask[];
  filteredTasks: VolunteerTask[];
  isLoading: boolean;
  filters: VolunteerFilterOptions;
  setFilters: (filters: VolunteerFilterOptions) => void;
  volunteerForTask: (input: VolunteerInput) => Promise<boolean>;
  updateTaskStatus: (input: StatusUpdateInput) => Promise<boolean>;
  addComment: (input: AddCommentInput) => Promise<boolean>;
  verifyTask: (taskId: number, userName: string, comment: string) => Promise<boolean>;
  reload: () => void;
  getTaskById: (id: number) => VolunteerTask | undefined;
}

export function useVolunteer(): UseVolunteerReturn {
  const [tasks, setTasks] = useState<VolunteerTask[]>(DUMMY_VOLUNTEER_TASKS);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<VolunteerFilterOptions>({
    scope: 'global',
    status: 'all',
    city: undefined,
  });

  // Filter tasks based on current filter settings
  const filteredTasks = tasks.filter((task) => {
    // Filter by status
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Filter by city (for local scope)
    if (filters.scope === 'local' && filters.city && filters.city !== 'All Cities') {
      if (task.city !== filters.city) {
        return false;
      }
    }

    return true;
  });

  const reload = useCallback(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setTasks([...DUMMY_VOLUNTEER_TASKS]);
      setIsLoading(false);
    }, 500);
  }, []);

  const getTaskById = useCallback(
    (id: number) => tasks.find((task) => task.id === id),
    [tasks]
  );

  // Volunteer for a task (assign yourself)
  const volunteerForTask = useCallback(
    async (input: VolunteerInput): Promise<boolean> => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === input.taskId) {
            const now = new Date().toISOString();
            const newComment: TaskComment = {
              id: Date.now(),
              taskId: input.taskId,
              userName: input.userName,
              comment: input.comment,
              createdAt: now,
            };
            const statusUpdate: StatusUpdate = {
              id: Date.now() + 1,
              taskId: input.taskId,
              previousStatus: task.status,
              newStatus: 'in_progress',
              userName: input.userName,
              comment: `Volunteered to help: ${input.comment}`,
              createdAt: now,
            };

            return {
              ...task,
              status: 'in_progress' as VolunteerTaskStatus,
              assignedTo: input.userName,
              assignedAt: now,
              comments: [...task.comments, newComment],
              statusHistory: [...task.statusHistory, statusUpdate],
            };
          }
          return task;
        })
      );

      setIsLoading(false);
      return true;
    },
    []
  );

  // Update task status with mandatory comment
  const updateTaskStatus = useCallback(
    async (input: StatusUpdateInput): Promise<boolean> => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === input.taskId) {
            const now = new Date().toISOString();
            const statusUpdate: StatusUpdate = {
              id: Date.now(),
              taskId: input.taskId,
              previousStatus: task.status,
              newStatus: input.newStatus,
              userName: input.userName,
              comment: input.comment,
              createdAt: now,
            };

            const updatedTask: VolunteerTask = {
              ...task,
              status: input.newStatus,
              statusHistory: [...task.statusHistory, statusUpdate],
            };

            // Update resolved info if marking as resolved
            if (input.newStatus === 'resolved') {
              updatedTask.resolvedAt = now;
              updatedTask.resolvedBy = input.userName;
            }

            return updatedTask;
          }
          return task;
        })
      );

      setIsLoading(false);
      return true;
    },
    []
  );

  // Add a comment to a task
  const addComment = useCallback(
    async (input: AddCommentInput): Promise<boolean> => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === input.taskId) {
            const newComment: TaskComment = {
              id: Date.now(),
              taskId: input.taskId,
              userName: input.userName,
              comment: input.comment,
              createdAt: new Date().toISOString(),
            };

            return {
              ...task,
              comments: [...task.comments, newComment],
            };
          }
          return task;
        })
      );

      setIsLoading(false);
      return true;
    },
    []
  );

  // Verify a resolved task (by someone other than the resolver)
  const verifyTask = useCallback(
    async (taskId: number, userName: string, comment: string): Promise<boolean> => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === taskId && task.status === 'resolved') {
            const now = new Date().toISOString();
            const statusUpdate: StatusUpdate = {
              id: Date.now(),
              taskId: taskId,
              previousStatus: 'resolved',
              newStatus: 'verified',
              userName: userName,
              comment: comment,
              createdAt: now,
            };

            return {
              ...task,
              status: 'verified' as VolunteerTaskStatus,
              verifiedAt: now,
              verifiedBy: userName,
              statusHistory: [...task.statusHistory, statusUpdate],
            };
          }
          return task;
        })
      );

      setIsLoading(false);
      return true;
    },
    []
  );

  return {
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
    getTaskById,
  };
}
