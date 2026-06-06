import * as Crypto from "expo-crypto";
import { getDb } from "@/shared/lib/database/db";
import { supabase } from "@/shared/lib/supabase";
import type { VaultCategory } from "@/entities/vault";

const rowToCategory = (row: any): VaultCategory => ({
  id: row.id,
  userId: row.user_id,
  label: row.label,
  icon: row.icon,
  color: row.color,
  sortOrder: row.sort_order,
  isDefault: row.is_default === 1,
});

// READ local
export const getLocalCategories = async (
  userId: string
): Promise<VaultCategory[]> => {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM vault_categories
     WHERE user_id = ? AND is_deleted = 0
     ORDER BY sort_order ASC`,
    [userId]
  );
  return rows.map(rowToCategory);
};

// FETCH — local dulu, fallback ke Supabase
export const fetchCategories = async (
  userId: string
): Promise<VaultCategory[]> => {
  const local = await getLocalCategories(userId);
  if (local.length > 0) return local;

  const { data, error } = await supabase
    .from("vault_categories")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order");

  if (error) throw error;
  if (!data?.length) return [];

  const db = await getDb();
  const now = Date.now();

  for (const cat of data) {
    await db.runAsync(
      `INSERT OR IGNORE INTO vault_categories
       (id, server_id, user_id, label, icon, color,
        sort_order, is_default, local_sync_status, is_deleted, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        Crypto.randomUUID(), cat.id, cat.user_id,
        cat.label, cat.icon, cat.color,
        cat.sort_order, cat.is_default ? 1 : 0,
        "synced", 0,
        new Date(cat.updated_at ?? now).getTime(),
      ]
    );
  }

  return getLocalCategories(userId);
};

// CREATE
export const createLocalCategory = async (
  userId: string,
  label: string,
  icon: string,
  color: string,
): Promise<VaultCategory> => {
  const generateId = (): string => {
    return Crypto.randomUUID();
  };

  const db = await getDb();
  const id = generateId();
  const existing = await db.getAllAsync<any>(
    "SELECT id FROM vault_categories WHERE user_id = ?", [userId]
  );

  await db.runAsync(
    `INSERT INTO vault_categories
     (id, user_id, label, icon, color, sort_order,
      is_default, local_sync_status, is_deleted, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [id, userId, label, icon, color,
      existing.length, 0, "pending", 0, Date.now()]
  );

  const row = await db.getFirstAsync<any>(
    "SELECT * FROM vault_categories WHERE id = ?", [id]
  );
  return rowToCategory(row);
};

// UPDATE
export const updateLocalCategory = async (
  id: string, label: string, icon: string
): Promise<VaultCategory> => {
  const db = await getDb();
  await db.runAsync(
    `UPDATE vault_categories
     SET label = ?, icon = ?, local_sync_status = 'pending', updated_at = ?
     WHERE id = ?`,
    [label, icon, Date.now(), id]
  );
  const row = await db.getFirstAsync<any>(
    "SELECT * FROM vault_categories WHERE id = ?", [id]
  );
  return rowToCategory(row);
};

// DELETE
export const deleteLocalCategory = async (id: string): Promise<void> => {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    "SELECT is_default FROM vault_categories WHERE id = ?", [id]
  );
  if (row?.is_default) throw new Error("Kategori default tidak bisa dihapus");

  await db.runAsync(
    `UPDATE vault_categories
     SET is_deleted = 1, local_sync_status = 'pending', updated_at = ?
     WHERE id = ?`,
    [Date.now(), id]
  );
};

// REORDER
export const updateCategorySortOrder = async (
  items: { id: string; sortOrder: number }[]
): Promise<void> => {
  const db = await getDb();
  for (const { id, sortOrder } of items) {
    await db.runAsync(
      `UPDATE vault_categories
       SET sort_order = ?, local_sync_status = 'pending', updated_at = ?
       WHERE id = ?`,
      [sortOrder, Date.now(), id]
    );
  }
};

// SYNC ke Supabase
export const syncCategories = async (userId: string): Promise<void> => {
  const db = await getDb();
  const pending = await db.getAllAsync<any>(
    `SELECT * FROM vault_categories
     WHERE user_id = ? AND local_sync_status IN ('pending','failed')`,
    [userId]
  );

  for (const cat of pending) {
    try {
      const payload = {
        user_id: cat.user_id,
        label: cat.label,
        icon: cat.icon,
        color: cat.color,
        sort_order: cat.sort_order,
        is_default: cat.is_default === 1,
        updated_at: new Date(cat.updated_at).toISOString(),
      };

      if (cat.is_deleted) {
        if (cat.server_id) {
          await supabase.from("vault_categories")
            .delete().eq("id", cat.server_id);
        }
        await db.runAsync(
          "DELETE FROM vault_categories WHERE id = ?", [cat.id]
        );
        continue;
      }

      if (cat.server_id) {
        await supabase.from("vault_categories")
          .update(payload).eq("id", cat.server_id);
      } else {
        const { data, error } = await supabase
          .from("vault_categories")
          .insert(payload).select("id").single();
        if (error) throw error;
        await db.runAsync(
          "UPDATE vault_categories SET server_id = ? WHERE id = ?",
          [data.id, cat.id]
        );
      }

      await db.runAsync(
        "UPDATE vault_categories SET local_sync_status = 'synced' WHERE id = ?",
        [cat.id]
      );
    } catch {
      await db.runAsync(
        "UPDATE vault_categories SET local_sync_status = 'failed' WHERE id = ?",
        [cat.id]
      );
    }
  }
};