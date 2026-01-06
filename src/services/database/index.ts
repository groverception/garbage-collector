import { Platform } from 'react-native';
import type { Upload, CreateUploadInput, UploadStatus } from '../../types/upload';

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

interface UploadRow {
  id: number;
  image_uri: string;
  thumbnail_uri: string | null;
  location: string;
  concern: string;
  user_name: string;
  status: UploadStatus;
  created_at: string;
  updated_at: string;
}

async function createSQLiteStorage(): Promise<Database> {
  const SQLite = require('expo-sqlite');

  class SQLiteStorageImpl implements Database {
    private db: any = null;

    async initDatabase(): Promise<void> {
      this.db = await SQLite.openDatabaseAsync('garbage_collector.db');

      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS schema_version (
          version INTEGER PRIMARY KEY
        )
      `);

      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS uploads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          image_uri TEXT NOT NULL,
          thumbnail_uri TEXT,
          location TEXT NOT NULL,
          concern TEXT NOT NULL,
          user_name TEXT NOT NULL,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'uploaded', 'reviewed', 'rejected')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.db.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads(created_at DESC)`
      );
    }

    async getSetting(key: string): Promise<string | null> {
      const result = await this.db.getFirstAsync(
        'SELECT value FROM settings WHERE key = ?',
        key
      );
      return result?.value ?? null;
    }

    async setSetting(key: string, value: string): Promise<void> {
      await this.db.runAsync(
        `INSERT INTO settings (key, value, updated_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP`,
        key,
        value,
        value
      );
    }

    async deleteSetting(key: string): Promise<void> {
      await this.db.runAsync('DELETE FROM settings WHERE key = ?', key);
    }

    async createUpload(input: CreateUploadInput): Promise<Upload> {
      const result = await this.db.runAsync(
        `INSERT INTO uploads (image_uri, thumbnail_uri, location, concern, user_name)
         VALUES (?, ?, ?, ?, ?)`,
        input.imageUri,
        input.thumbnailUri ?? null,
        input.location,
        input.concern,
        input.userName
      );

      const upload = await this.getUploadById(result.lastInsertRowId);
      if (!upload) {
        throw new Error('Failed to create upload');
      }
      return upload;
    }

    async getUploadById(id: number): Promise<Upload | null> {
      const row: UploadRow | null = await this.db.getFirstAsync(
        'SELECT * FROM uploads WHERE id = ?',
        id
      );

      if (!row) return null;

      return {
        id: row.id,
        imageUri: row.image_uri,
        thumbnailUri: row.thumbnail_uri,
        location: row.location,
        concern: row.concern,
        userName: row.user_name,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    }

    async getAllUploads(): Promise<Upload[]> {
      const rows: UploadRow[] = await this.db.getAllAsync(
        'SELECT * FROM uploads ORDER BY created_at DESC'
      );

      return rows.map((row: UploadRow) => ({
        id: row.id,
        imageUri: row.image_uri,
        thumbnailUri: row.thumbnail_uri,
        location: row.location,
        concern: row.concern,
        userName: row.user_name,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }

    async deleteUpload(id: number): Promise<void> {
      await this.db.runAsync('DELETE FROM uploads WHERE id = ?', id);
    }

    async deleteAllUploads(): Promise<void> {
      await this.db.runAsync('DELETE FROM uploads');
    }
  }

  const storage = new SQLiteStorageImpl();
  await storage.initDatabase();
  return storage;
}

export async function initDatabase(): Promise<void> {
  if (dbInstance) return;

  if (Platform.OS === 'web') {
    dbInstance = new WebStorage();
    await dbInstance.initDatabase();
  } else {
    dbInstance = await createSQLiteStorage();
  }
}

export function getDatabase(): Database {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
}
