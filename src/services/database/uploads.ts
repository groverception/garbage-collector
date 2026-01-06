import { getDatabase } from './index';
import type { Upload, CreateUploadInput } from '../../types/upload';

export async function createUpload(input: CreateUploadInput): Promise<Upload> {
  const db = getDatabase();
  return db.createUpload(input);
}

export async function getUploadById(id: number): Promise<Upload | null> {
  const db = getDatabase();
  return db.getUploadById(id);
}

export async function getAllUploads(): Promise<Upload[]> {
  const db = getDatabase();
  return db.getAllUploads();
}

export async function deleteUpload(id: number): Promise<void> {
  const db = getDatabase();
  await db.deleteUpload(id);
}

export async function deleteAllUploads(): Promise<void> {
  const db = getDatabase();
  await db.deleteAllUploads();
}
