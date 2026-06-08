import * as Crypto from "expo-crypto";
import { getDb } from "@/shared/lib/database/db";
import { encrypt, decrypt } from "@/shared/lib/encryption";
import type { VaultItem, VaultItemForm } from "@/entities/vault";

// Helper: row → VaultItem
const rowToItem = async (row: any, userId: string): Promise<VaultItem> => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  categoryId: row.category_id,
  isFavorite: row.is_favorite === 1,
  iconType: row.icon_type,
  iconValue: row.icon_value,
  iconColor: row.icon_color,
  username: row.username ?? "",
  email: row.email ?? "",
  password: row.password ? await decrypt(row.password, userId) : "",
  pin: row.pin ? await decrypt(row.pin, userId) : "",
  phone: row.phone ?? "",
  url: row.url ?? "",
  notes: row.notes ?? "",
  holderName: row.holder_name ?? "",
  expiredDate: row.expired_date ?? "",
  customFields: (() => {
    try { return JSON.parse(row.custom_fields || "[]"); } catch { return []; }
  })(),
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});

// READ
export const getLocalVaultItems = async (
  userId: string
): Promise<VaultItem[]> => {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM vault_items
     WHERE user_id = ? AND is_deleted = 0
     ORDER BY is_favorite DESC, updated_at DESC`,
    [userId]
  );
  return Promise.all(rows.map((r) => rowToItem(r, userId)));
};

const generateId = (): string => {
  return Crypto.randomUUID();
};

// CREATE
export const createLocalVaultItem = async (
  userId: string,
  form: VaultItemForm
): Promise<VaultItem> => {
  const db = await getDb();
  const id = generateId();
  const now = Date.now();

  const encPassword = form.password ? await encrypt(form.password, userId) : null;
  const encPin = form.pin ? await encrypt(form.pin, userId) : null;

  await db.runAsync(
    `INSERT INTO vault_items (
      id, user_id, title, category_id, is_favorite,
      icon_type, icon_value, icon_color,
      username, email, password, pin, phone, url,
      notes, holder_name, expired_date, custom_fields,
      local_sync_status, is_deleted, created_at, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      id, userId, form.title, form.categoryId,
      form.isFavorite ? 1 : 0,
      form.iconType, form.iconValue, form.iconColor,
      form.username || null,
      form.email || null,
      encPassword,
      encPin,
      form.phone || null,
      form.url || null,
      form.notes || null,
      form.holderName || null,
      form.expiredDate || null,
      JSON.stringify(form.customFields ?? []),
      "pending", 0, now, now,
    ]
  );

  const row = await db.getFirstAsync<any>(
    "SELECT * FROM vault_items WHERE id = ?", [id]
  );
  return rowToItem(row, userId);
};

// UPDATE
export const updateLocalVaultItem = async (
  userId: string,
  id: string,
  form: Partial<VaultItemForm>
): Promise<VaultItem> => {
  const db = await getDb();
  const now = Date.now();

  const encPassword = form.password !== undefined
    ? (form.password ? await encrypt(form.password, userId) : null)
    : undefined;

  const encPin = form.pin !== undefined
    ? (form.pin ? await encrypt(form.pin, userId) : null)
    : undefined;

  await db.runAsync(
    `UPDATE vault_items SET
      title           = COALESCE(?, title),
      category_id     = COALESCE(?, category_id),
      is_favorite     = COALESCE(?, is_favorite),
      icon_type       = COALESCE(?, icon_type),
      icon_value      = COALESCE(?, icon_value),
      icon_color      = COALESCE(?, icon_color),
      username        = ?,
      email           = ?,
      password        = COALESCE(?, password),
      pin             = COALESCE(?, pin),
      phone           = ?,
      url             = ?,
      notes           = ?,
      holder_name     = ?,
      expired_date    = ?,
      custom_fields   = COALESCE(?, custom_fields),
      local_sync_status = 'pending',
      updated_at      = ?
    WHERE id = ? AND user_id = ?`,
    [
      form.title ?? null,
      form.categoryId ?? null,
      form.isFavorite !== undefined ? (form.isFavorite ? 1 : 0) : null,
      form.iconType ?? null,
      form.iconValue ?? null,
      form.iconColor ?? null,
      form.username ?? null,
      form.email ?? null,
      encPassword ?? null,
      encPin ?? null,
      form.phone ?? null,
      form.url ?? null,
      form.notes ?? null,
      form.holderName ?? null,
      form.expiredDate ?? null,
      form.customFields ? JSON.stringify(form.customFields) : null,
      now, id, userId,
    ]
  );

  const row = await db.getFirstAsync<any>(
    "SELECT * FROM vault_items WHERE id = ?", [id]
  );
  return rowToItem(row, userId);
};

// DELETE (soft)
export const deleteLocalVaultItem = async (
  userId: string,
  id: string
): Promise<void> => {
  const db = await getDb();

  console.log("DB delete:", { userId, id });

  const existing = await db.getFirstAsync<any>(
    "SELECT id FROM vault_items WHERE id = ? AND user_id = ?",
    [id, userId]
  );

  console.log("Found for delete:", existing);

  if (!existing) {
    throw new Error(`Item ${id} tidak ditemukan untuk user ${userId}`);
  }

  await db.runAsync(
    `UPDATE vault_items
     SET is_deleted = 1, local_sync_status = 'pending', updated_at = ?
     WHERE id = ? AND user_id = ?`,
    [Date.now(), id, userId]
  );

  console.log("Delete done");
};

// TOGGLE FAVORITE
export const toggleLocalFavorite = async (
  userId: string,
  id: string,
  current: boolean
): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    `UPDATE vault_items
     SET is_favorite = ?, local_sync_status = 'pending', updated_at = ?
     WHERE id = ? AND user_id = ?`,
    [current ? 0 : 1, Date.now(), id, userId]
  );
};

// GET PENDING (untuk sync)
export const getPendingItems = async (userId: string) => {
  const db = await getDb();
  return db.getAllAsync<any>(
    `SELECT * FROM vault_items
     WHERE user_id = ? AND local_sync_status IN ('pending','failed')`,
    [userId]
  );
};

// MARK SYNCED
export const markItemSynced = async (
  id: string,
  serverId: string
): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    `UPDATE vault_items
     SET local_sync_status = 'synced', server_id = ?
     WHERE id = ?`,
    [serverId, id]
  );
};

// MARK FAILED
export const markItemFailed = async (id: string): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    `UPDATE vault_items SET local_sync_status = 'failed' WHERE id = ?`,
    [id]
  );
};

// UPSERT dari server (untuk pull)
export const upsertItemFromServer = async (
  userId: string,
  serverItem: any
): Promise<void> => {
  const db = await getDb();
  const now = Date.now();

  // Password dari server sudah encrypted — decrypt dulu untuk simpan ke local
  // (local DB simpan plain, enkripsi ulang saat push ke server)
  const password = serverItem.password
    ? await decrypt(serverItem.password, userId) : null;
  const pin = serverItem.pin
    ? await decrypt(serverItem.pin, userId) : null;

  const existing = await db.getFirstAsync<any>(
    "SELECT * FROM vault_items WHERE server_id = ?",
    [serverItem.id]
  );

  if (existing) {
    const serverTime = new Date(serverItem.updated_at).getTime();
    if (serverTime <= existing.updated_at) return;

    await db.runAsync(
      `UPDATE vault_items SET
        title = ?, category_id = ?, is_favorite = ?,
        icon_type = ?, icon_value = ?, icon_color = ?,
        username = ?, email = ?, password = ?, pin = ?,
        phone = ?, url = ?, notes = ?,
        holder_name = ?, expired_date = ?, custom_fields = ?,
        local_sync_status = 'synced', updated_at = ?
       WHERE server_id = ?`,
      [
        serverItem.title, serverItem.category_id,
        serverItem.is_favorite ? 1 : 0,
        serverItem.icon_type, serverItem.icon_value, serverItem.icon_color,
        serverItem.username ?? null,
        serverItem.email ?? null,
        password,
        pin,
        serverItem.phone ?? null,
        serverItem.url ?? null,
        serverItem.notes ?? null,
        serverItem.holder_name ?? null,
        serverItem.expired_date ?? null,
        JSON.stringify(serverItem.custom_fields ?? []),
        new Date(serverItem.updated_at).getTime(),
        serverItem.id,
      ]
    );
  } else {
    await db.runAsync(
      `INSERT OR IGNORE INTO vault_items (
        id, server_id, user_id, title, category_id, is_favorite,
        icon_type, icon_value, icon_color,
        username, email, password, pin, phone, url,
        notes, holder_name, expired_date, custom_fields,
        local_sync_status, is_deleted, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        generateId(), serverItem.id, userId,
        serverItem.title, serverItem.category_id,
        serverItem.is_favorite ? 1 : 0,
        serverItem.icon_type, serverItem.icon_value, serverItem.icon_color,
        serverItem.username ?? null,
        serverItem.email ?? null,
        password,
        pin,
        serverItem.phone ?? null,
        serverItem.url ?? null,
        serverItem.notes ?? null,
        serverItem.holder_name ?? null,
        serverItem.expired_date ?? null,
        JSON.stringify(serverItem.custom_fields ?? []),
        "synced", 0, now,
        new Date(serverItem.updated_at).getTime(),
      ]
    );
  }
};