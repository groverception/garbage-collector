export type UploadStatus = 'pending' | 'uploaded' | 'reviewed' | 'rejected';

export interface Upload {
  id: number;
  imageUri: string;
  thumbnailUri: string | null;
  location: string;
  concern: string;
  userName: string;
  status: UploadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UploadFormData {
  imageUri: string;
  location: string;
  concern: string;
}

export interface CreateUploadInput {
  imageUri: string;
  thumbnailUri?: string;
  location: string;
  concern: string;
  userName: string;
}
