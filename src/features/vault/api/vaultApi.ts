import * as Crypto from "expo-crypto";
import { getDb } from "@/shared/lib/database/db";
import { encrypt, decrypt } from "@/shared/lib/encryption";
import type { VaultItem, VaultItemForm } from "@/entities/vault";

const generateId = (): string => Crypto.randomUUID();

// ── Query Helpers ──────────────────────────────────────────────

const ENCRYPTED_FIELDS = [
  "username", "email", "password", "pin", "phone", "url",
  "notes", "holderName", "expiredDate", "customFields",
] as const;

import { getSessionPin } from "@/shared/lib/sessionPin";

const decryptItem = async (item: VaultItem): Promise<VaultItem> => {
  const pin = getSessionPin();
  const results = await Promise.all(
    ENCRYPTED_FIELDS.map((f) => {
      const val = item[f];
      if (!val || (typeof val === "string" && !val)) return undefined;
      if (f === "customFields" && typeof val === "string") {
        return decrypt(val, pin ?? undefined).then((dec) => {
          try { return JSON.parse(dec); } catch { return []; }
        });
      }
      if (typeof val === "string") {
        return decrypt(val, pin ?? undefined);
      }
      return val;
    })
  );
  const decrypted = {} as any;
  ENCRYPTED_FIELDS.forEach((f, i) => { decrypted[f] = results[i]; });
  return { ...item, ...decrypted };
};

const encVal = async (val: any): Promise<string | null> => {
  if (val === undefined || val === null) return null;
  const str = typeof val === "string" ? val : JSON.stringify(val);
  if (!str) return null;
  const pin = getSessionPin();
  return encrypt(str, pin ?? undefined);
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

  const conditions = ["user_id = ?", "is_deleted = 0"];
  const params: any[] = [userId];

  if (categoryId) {
    conditions.push("category_id = ?");
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

  const [encUsername, encEmail, encPassword, encPin, encPhone, encUrl,
    encNotes, encHolder, encExpired, encCustom] = await Promise.all([
    encVal(form.username),
    encVal(form.email),
    encVal(form.password),
    encVal(form.pin),
    encVal(form.phone),
    encVal(form.url),
    encVal(form.notes),
    encVal(form.holderName),
    encVal(form.expiredDate),
    encVal(form.customFields),
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
      encUsername, encEmail, encPassword, encPin,
      encPhone, encUrl, encNotes, encHolder,
      encExpired, encCustom,
      now, now,
    ]
  );

  return id;
};

// ── UPDATE ─────────────────────────────────────────────────────

export const updateLocalVaultItem = async (
  id: string,
  form: VaultItemForm,
): Promise<void> => {
  const db = await getDb();
  const now = Date.now();

  const [encUsername, encEmail, encPassword, encPin, encPhone, encUrl,
    encNotes, encHolder, encExpired, encCustom] = await Promise.all([
    encVal(form.username),
    encVal(form.email),
    encVal(form.password),
    encVal(form.pin),
    encVal(form.phone),
    encVal(form.url),
    encVal(form.notes),
    encVal(form.holderName),
    encVal(form.expiredDate),
    encVal(form.customFields),
  ]);

  await db.runAsync(
    `UPDATE vault_items SET
      title = ?, category_id = ?,
      icon_type = ?, icon_value = ?, icon_color = ?,
      username = ?, email = ?, password = ?, pin = ?,
      phone = ?, url = ?, notes = ?, holder_name = ?,
      expired_date = ?, custom_fields = ?,
      local_sync_status = 'pending', updated_at = ?
     WHERE id = ?`,
    [
      form.title, form.categoryId,
      form.iconType, form.iconValue, form.iconColor,
      encUsername, encEmail, encPassword, encPin,
      encPhone, encUrl, encNotes, encHolder,
      encExpired, encCustom,
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

  // Server data sudah terenkripsi → decrypt dulu untuk dapat plaintext
  const [rawPassword, rawPin, rawNotes] = await Promise.all([
    serverItem.password ? decrypt(serverItem.password) : Promise.resolve(null),
    serverItem.pin ? decrypt(serverItem.pin) : Promise.resolve(null),
    serverItem.notes ? decrypt(serverItem.notes) : Promise.resolve(null),
  ]);

  // Enkripsi semua field untuk local storage
  const [encUsername, encEmail, encPassword, encPin, encPhone, encUrl,
    encNotes, encHolder, encExpired, encCustom] = await Promise.all([
    encVal(serverItem.username),
    encVal(serverItem.email),
    rawPassword ? encrypt(rawPassword) : Promise.resolve(null),
    rawPin ? encrypt(rawPin) : Promise.resolve(null),
    encVal(serverItem.phone),
    encVal(serverItem.url),
    rawNotes ? encrypt(rawNotes) : Promise.resolve(null),
    encVal(serverItem.holder_name),
    encVal(serverItem.expired_date),
    encVal(serverItem.custom_fields),
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
        encUsername, encEmail, encPassword, encPin,
        encPhone, encUrl, encNotes, encHolder,
        encExpired, encCustom,
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
        encUsername, encEmail, encPassword, encPin,
        encPhone, encUrl, encNotes, encHolder,
        encExpired, encCustom,
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
