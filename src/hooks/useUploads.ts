import { useState, useEffect, useCallback } from 'react';
import {
  getAllUploads,
  createUpload as createUploadDb,
  deleteUpload as deleteUploadDb,
  deleteAllUploads as deleteAllUploadsDb,
} from '../services/database/uploads';
import type { Upload, CreateUploadInput } from '../types/upload';

export function useUploads() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUploads = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllUploads();
      setUploads(data);
    } catch (error) {
      console.error('Error loading uploads:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUploads();
  }, [loadUploads]);

  const createUpload = useCallback(async (input: CreateUploadInput): Promise<Upload> => {
    const upload = await createUploadDb(input);
    setUploads((prev) => [upload, ...prev]);
    return upload;
  }, []);

  const deleteUpload = useCallback(async (id: number) => {
    await deleteUploadDb(id);
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const deleteAllUploads = useCallback(async () => {
    await deleteAllUploadsDb();
    setUploads([]);
  }, []);

  return {
    uploads,
    isLoading,
    createUpload,
    deleteUpload,
    deleteAllUploads,
    reload: loadUploads,
  };
}
