import * as SQLite from 'expo-sqlite';
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

interface UploadRow {
  id: number;
  image_uri: string;
  thumbnail_uri: string | null;
  location: string;
  description: string;
  user_name: string;
  status: UploadStatus;
  created_at: string;
  updated_at: string;
}

class SQLiteStorage implements Database {
  private db: SQLite.SQLiteDatabase | null = null;

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
        description TEXT NOT NULL,
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
    const result = await this.db!.getFirstAsync<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      key
    );
    return result?.value ?? null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await this.db!.runAsync(
      `INSERT INTO settings (key, value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP`,
      key,
      value,
      value
    );
  }

  async deleteSetting(key: string): Promise<void> {
    await this.db!.runAsync('DELETE FROM settings WHERE key = ?', key);
  }

  async createUpload(input: CreateUploadInput): Promise<Upload> {
    const result = await this.db!.runAsync(
      `INSERT INTO uploads (image_uri, thumbnail_uri, location, description, user_name)
       VALUES (?, ?, ?, ?, ?)`,
      input.imageUri,
      input.thumbnailUri ?? null,
      input.location,
      input.description,
      input.userName
    );

    const upload = await this.getUploadById(result.lastInsertRowId);
    if (!upload) {
      throw new Error('Failed to create upload');
    }
    return upload;
  }

  async getUploadById(id: number): Promise<Upload | null> {
    const row = await this.db!.getFirstAsync<UploadRow>(
      'SELECT * FROM uploads WHERE id = ?',
      id
    );

    if (!row) return null;

    return {
      id: row.id,
      imageUri: row.image_uri,
      thumbnailUri: row.thumbnail_uri,
      location: row.location,
      description: row.description,
      userName: row.user_name,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getAllUploads(): Promise<Upload[]> {
    const rows = await this.db!.getAllAsync<UploadRow>(
      'SELECT * FROM uploads ORDER BY created_at DESC'
    );

    return rows.map((row: UploadRow) => ({
      id: row.id,
      imageUri: row.image_uri,
      thumbnailUri: row.thumbnail_uri,
      location: row.location,
      description: row.description,
      userName: row.user_name,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async deleteUpload(id: number): Promise<void> {
    await this.db!.runAsync('DELETE FROM uploads WHERE id = ?', id);
  }

  async deleteAllUploads(): Promise<void> {
    await this.db!.runAsync('DELETE FROM uploads');
  }
}

export async function initDatabase(): Promise<void> {
  if (dbInstance) return;
  dbInstance = new SQLiteStorage();
  await dbInstance.initDatabase();
}

export function getDatabase(): Database {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
}
