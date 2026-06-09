import * as SQLite from "expo-sqlite";

let _db: SQLite.SQLiteDatabase | null = null;
let _initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  // Sudah ada instance → langsung return
  if (_db) return _db;

  // Sedang proses init → tunggu promise yang sama
  if (_initPromise) return _initPromise;

  // Mulai init — simpan promise agar tidak double init
  _initPromise = (async () => {
    try {
      const db = await SQLite.openDatabaseAsync("passandi.db");
      await initDb(db);
      _db = db;
      return db;
    } catch (e) {
      // Reset agar bisa retry
      _initPromise = null;
      throw e;
    }
  })();

  return _initPromise;
};

// Reset untuk testing
export const resetDb = () => {
  _db = null;
  _initPromise = null;
};

const initDb = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS vault_items (
      id                TEXT PRIMARY KEY,
      server_id         TEXT,
      user_id           TEXT NOT NULL,
      title             TEXT NOT NULL,
      category_id       TEXT NOT NULL DEFAULT 'other',
      is_favorite       INTEGER NOT NULL DEFAULT 0,
      icon_type         TEXT NOT NULL DEFAULT 'emoji',
      icon_value        TEXT NOT NULL DEFAULT '🔐',
      icon_color        TEXT NOT NULL DEFAULT '#2563EB',
      username          TEXT,
      email             TEXT,
      password          TEXT,
      pin               TEXT,
      phone             TEXT,
      url               TEXT,
      notes             TEXT,
      holder_name       TEXT,
      expired_date      TEXT,
      custom_fields     TEXT NOT NULL DEFAULT '[]',
      local_sync_status TEXT NOT NULL DEFAULT 'pending',
      is_deleted        INTEGER NOT NULL DEFAULT 0,
      created_at        INTEGER NOT NULL,
      updated_at        INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS vault_categories (
      id                TEXT PRIMARY KEY,
      server_id         TEXT,
      user_id           TEXT NOT NULL,
      label             TEXT NOT NULL,
      icon              TEXT NOT NULL DEFAULT '📁',
      color             TEXT NOT NULL DEFAULT '#2563EB',
      sort_order        INTEGER NOT NULL DEFAULT 0,
      is_default        INTEGER NOT NULL DEFAULT 0,
      local_sync_status TEXT NOT NULL DEFAULT 'pending',
      is_deleted        INTEGER NOT NULL DEFAULT 0,
      updated_at        INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_vault_items_user
      ON vault_items(user_id, is_deleted, updated_at);

    CREATE INDEX IF NOT EXISTS idx_vault_items_sync
      ON vault_items(user_id, local_sync_status);

    CREATE INDEX IF NOT EXISTS idx_vault_categories_user
      ON vault_categories(user_id, is_deleted, sort_order);
  `);
};