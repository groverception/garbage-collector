export type UploadStatus = 'pending' | 'uploaded' | 'reviewed' | 'rejected';

export interface Upload {
  id: number;
  imageUri: string;
  thumbnailUri: string | null;
  location: string;
  description: string;
  userName: string;
  status: UploadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UploadFormData {
  imageUri: string;
  location: string;
  description: string;
}

export interface CreateUploadInput {
  imageUri: string;
  thumbnailUri?: string;
  location: string;
  description: string;
  userName: string;
}
