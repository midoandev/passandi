import * as Crypto from "expo-crypto";
import { getDb } from "@/shared/lib/database/db";
import { encrypt, decrypt } from "@/shared/lib/encryption";
import type { VaultItem, VaultItemForm } from "@/entities/vault";

const generateId = (): string => Crypto.randomUUID();

// ── Query Helpers ──────────────────────────────────────────────

const SENSITIVE_FIELDS = ["password", "pin", "notes"] as const;

const decryptItem = async (item: VaultItem): Promise<VaultItem> => {
  const [password, pin, notes] = await Promise.all([
    item.password ? decrypt(item.password, item.userId) : undefined,
    item.pin ? decrypt(item.pin, item.userId) : undefined,
    item.notes ? decrypt(item.notes, item.userId) : undefined,
  ]);
  return { ...item, password, pin, notes };
};

const decryptItems = async (items: VaultItem[]): Promise<VaultItem[]> =>
  Promise.all(items.map(decryptItem));

// ── Query Helpers ──────────────────────────────────────────────

const ITEM_FIELDS = `
  id, server_id, user_id, title, category_id, is_favorite,
  icon_type, icon_value, icon_color,
  username, email, password, pin, phone, url,
  notes, holder_name, expired_date, custom_fields,
  created_at, updated_at
`;

const mapRow = (row: any): VaultItem => ({
  id: row.id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  userId: row.user_id,
  title: row.title,
  categoryId: row.category_id,
  isFavorite: row.is_favorite === 1,
  iconType: row.icon_type as VaultItem["iconType"],
  iconValue: row.icon_value,
  iconColor: row.icon_color,
  username: row.username ?? undefined,
  email: row.email ?? undefined,
  password: row.password ?? undefined,
  pin: row.pin ?? undefined,
  phone: row.phone ?? undefined,
  url: row.url ?? undefined,
  notes: row.notes ?? undefined,
  holderName: row.holder_name ?? undefined,
  expiredDate: row.expired_date ?? undefined,
  customFields: (() => {
    try { return JSON.parse(row.custom_fields || "[]"); } catch { return []; }
  })(),
});

// ── READ ───────────────────────────────────────────────────────

export const getLocalVaultItems = async (
  userId: string,
  categoryId: string | null,
  page: number,
  limit: number,
  searchQuery: string,
): Promise<{ items: VaultItem[]; total: number }> => {
  const db = await getDb();
  const offset = (page - 1) * limit;

  const conditions = ["user_id = ?"];
  const params: any[] = [userId];

  if (categoryId) {
    conditions.push("category_id = ?");
    // Always show non-deleted items
    conditions.push("is_deleted = 0");
    params.push(categoryId);
  }
  if (searchQuery) {
    conditions.push("title LIKE ?");
    params.push(`%${searchQuery}%`);
  }

  const where = conditions.join(" AND ");

  const [{ count }] = await db.getAllAsync<any>(
    `SELECT COUNT(*) as count FROM vault_items WHERE ${where}`,
    params
  );

  const rows = await db.getAllAsync<any>(
    `SELECT ${ITEM_FIELDS} FROM vault_items
     WHERE ${where}
     ORDER BY is_favorite DESC, title ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const items = await decryptItems(rows.map(mapRow));
  return { items, total: count };
};

export const getAllLocalItems = async (
  userId: string,
): Promise<VaultItem[]> => {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT ${ITEM_FIELDS} FROM vault_items
     WHERE user_id = ? AND is_deleted = 0
     ORDER BY title ASC`,
    [userId]
  );
  return decryptItems(rows.map(mapRow));
};

export const getVaultItemById = async (
  id: string,
): Promise<VaultItem | null> => {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(
    `SELECT ${ITEM_FIELDS} FROM vault_items WHERE id = ?`,
    [id]
  );
  if (!row) return null;
  return decryptItem(mapRow(row));
};

// ── CREATE ─────────────────────────────────────────────────────

export const createLocalVaultItem = async (
  userId: string,
  form: VaultItemForm,
): Promise<string> => {
  const db = await getDb();
  const id = generateId();
  const now = Date.now();

  const [encPassword, encPin, encNotes] = await Promise.all([
    form.password ? encrypt(form.password, userId) : Promise.resolve(null),
    form.pin ? encrypt(form.pin, userId) : Promise.resolve(null),
    form.notes ? encrypt(form.notes, userId) : Promise.resolve(null),
  ]);

  await db.runAsync(
    `INSERT INTO vault_items (
      id, server_id, user_id, title, category_id, is_favorite,
      icon_type, icon_value, icon_color,
      username, email, password, pin, phone, url,
      notes, holder_name, expired_date, custom_fields,
      local_sync_status, is_deleted, created_at, updated_at
    ) VALUES (?, null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?)`,
    [
      id, userId,
      form.title, form.categoryId, 0,
      form.iconType, form.iconValue, form.iconColor,
      form.username ?? null, form.email ?? null,
      encPassword, encPin,
      form.phone ?? null, form.url ?? null,
      encNotes, form.holderName ?? null,
      form.expiredDate ?? null,
      JSON.stringify(form.customFields ?? []),
      now, now,
    ]
  );

  return id;
};

// ── UPDATE ─────────────────────────────────────────────────────

export const updateLocalVaultItem = async (
  id: string,
  form: VaultItemForm,
  userId?: string,
): Promise<void> => {
  const db = await getDb();
  const now = Date.now();

  // Encrypt if userId provided (caller must pass it for write operations)
  const [encPassword, encPin, encNotes] = await Promise.all([
    form.password && userId ? encrypt(form.password, userId) : Promise.resolve(form.password ?? null),
    form.pin && userId ? encrypt(form.pin, userId) : Promise.resolve(form.pin ?? null),
    form.notes && userId ? encrypt(form.notes, userId) : Promise.resolve(form.notes ?? null),
  ]);

  await db.runAsync(
    `UPDATE vault_items SET
      title = ?, category_id = ?,
      icon_type = ?, icon_value = ?, icon_color = ?,
      username = ?, email = ?,
      password = ?, pin = ?, phone = ?, url = ?,
      notes = ?, holder_name = ?, expired_date = ?,
      custom_fields = ?,
      local_sync_status = 'pending', updated_at = ?
     WHERE id = ?`,
    [
      form.title, form.categoryId,
      form.iconType, form.iconValue, form.iconColor,
      form.username ?? null, form.email ?? null,
      encPassword, encPin,
      form.phone ?? null, form.url ?? null,
      encNotes, form.holderName ?? null,
      form.expiredDate ?? null,
      JSON.stringify(form.customFields ?? []),
      now, id,
    ]
  );
};

// ── DELETE (soft) ──────────────────────────────────────────────

export const deleteLocalVaultItem = async (
  userId: string,
  id: string
): Promise<void> => {
  const db = await getDb();

  const existing = await db.getFirstAsync<any>(
    "SELECT id FROM vault_items WHERE id = ? AND user_id = ?",
    [id, userId]
  );

  if (!existing) {
    throw new Error(`Item ${id} tidak ditemukan untuk user ${userId}`);
  }

  await db.runAsync(
    `UPDATE vault_items
     SET is_deleted = 1, local_sync_status = 'pending', updated_at = ?
     WHERE id = ? AND user_id = ?`,
    [Date.now(), id, userId]
  );
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
  serverId: string,
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

  // Server data sudah terenkripsi → decrypt dulu
  const [rawPassword, rawPin, rawNotes] = await Promise.all([
    serverItem.password ? decrypt(serverItem.password, userId) : Promise.resolve(null),
    serverItem.pin ? decrypt(serverItem.pin, userId) : Promise.resolve(null),
    serverItem.notes ? decrypt(serverItem.notes, userId) : Promise.resolve(null),
  ]);

  // Re-encrypt untuk local storage
  const [encPassword, encPin, encNotes] = await Promise.all([
    rawPassword ? encrypt(rawPassword, userId) : Promise.resolve(null),
    rawPin ? encrypt(rawPin, userId) : Promise.resolve(null),
    rawNotes ? encrypt(rawNotes, userId) : Promise.resolve(null),
  ]);

  const existing = await db.getFirstAsync<any>(
    "SELECT * FROM vault_items WHERE server_id = ?",
    [serverItem.id]
  );

  if (existing) {
    await db.runAsync(
      `UPDATE vault_items SET
        title = ?, category_id = ?, is_favorite = ?,
        username = ?, email = ?, password = ?, pin = ?,
        phone = ?, url = ?, notes = ?, holder_name = ?,
        expired_date = ?, custom_fields = ?,
        local_sync_status = 'synced', updated_at = ?
       WHERE id = ?`,
      [
        serverItem.title, serverItem.category_id,
        serverItem.is_favorite ? 1 : 0,
        serverItem.username ?? null, serverItem.email ?? null,
        encPassword, encPin, serverItem.phone ?? null,
        serverItem.url ?? null, encNotes,
        serverItem.holder_name ?? null,
        serverItem.expired_date ?? null,
        JSON.stringify(serverItem.custom_fields ?? []),
        new Date(serverItem.updated_at).getTime(),
        existing.id,
      ]
    );
  } else {
    const id = generateId();
    const now = new Date(serverItem.updated_at).getTime();
    await db.runAsync(
      `INSERT OR IGNORE INTO vault_items (
        id, server_id, user_id, title, category_id, is_favorite,
        icon_type, icon_value, icon_color,
        username, email, password, pin, phone, url,
        notes, holder_name, expired_date, custom_fields,
        local_sync_status, is_deleted, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id, serverItem.id, userId,
        serverItem.title, serverItem.category_id,
        serverItem.is_favorite ? 1 : 0,
        serverItem.icon_type ?? "emoji",
        serverItem.icon_value ?? "🔐",
        serverItem.icon_color ?? "#2563EB",
        serverItem.username ?? null, serverItem.email ?? null,
        encPassword, encPin, serverItem.phone ?? null,
        serverItem.url ?? null, encNotes,
        serverItem.holder_name ?? null,
        serverItem.expired_date ?? null,
        JSON.stringify(serverItem.custom_fields ?? []),
        "synced", 0, now,
        new Date(serverItem.updated_at).getTime(),
      ]
    );
  }
};

// CLEAR LOCAL — hapus semua vault items milik user
export const clearLocalVaultData = async (userId: string): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    "DELETE FROM vault_items WHERE user_id = ?",
    [userId]
  );
};
