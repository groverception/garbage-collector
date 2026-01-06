import type { Upload, CreateUploadInput } from '../../types/upload';

interface Database {
  initDatabase(): Promise<void>;
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
  deleteSetting(key: string): Promise<void>;
  createUpload(input: CreateUploadInput): Promise<Upload>;
  getUploadById(id: number): Promise<Upload | null>;
  getAllUploads(): Promise<Upload[]>;
  deleteUpload(id: number): Promise<void>;
  deleteAllUploads(): Promise<void>;
}

let dbInstance: Database | null = null;

class WebStorage implements Database {
  private uploads: Upload[] = [];
  private settings: Record<string, string> = {};
  private nextId = 1;

  async initDatabase(): Promise<void> {
    try {
      const storedUploads = localStorage.getItem('gc_uploads');
      const storedSettings = localStorage.getItem('gc_settings');
      const storedNextId = localStorage.getItem('gc_nextId');

      if (storedUploads) this.uploads = JSON.parse(storedUploads);
      if (storedSettings) this.settings = JSON.parse(storedSettings);
      if (storedNextId) this.nextId = parseInt(storedNextId, 10);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveUploads(): void {
    localStorage.setItem('gc_uploads', JSON.stringify(this.uploads));
    localStorage.setItem('gc_nextId', this.nextId.toString());
  }

  private saveSettings(): void {
    localStorage.setItem('gc_settings', JSON.stringify(this.settings));
  }

  async getSetting(key: string): Promise<string | null> {
    return this.settings[key] ?? null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    this.settings[key] = value;
    this.saveSettings();
  }

  async deleteSetting(key: string): Promise<void> {
    delete this.settings[key];
    this.saveSettings();
  }

  async createUpload(input: CreateUploadInput): Promise<Upload> {
    const now = new Date().toISOString();
    const upload: Upload = {
      id: this.nextId++,
      imageUri: input.imageUri,
      thumbnailUri: input.thumbnailUri ?? null,
      location: input.location,
      concern: input.concern,
      userName: input.userName,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    this.uploads.unshift(upload);
    this.saveUploads();
    return upload;
  }

  async getUploadById(id: number): Promise<Upload | null> {
    return this.uploads.find((u) => u.id === id) ?? null;
  }

  async getAllUploads(): Promise<Upload[]> {
    return [...this.uploads];
  }

  async deleteUpload(id: number): Promise<void> {
    this.uploads = this.uploads.filter((u) => u.id !== id);
    this.saveUploads();
  }

  async deleteAllUploads(): Promise<void> {
    this.uploads = [];
    this.saveUploads();
  }
}

export async function initDatabase(): Promise<void> {
  if (dbInstance) return;
  dbInstance = new WebStorage();
  await dbInstance.initDatabase();
}

export function getDatabase(): Database {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
}
