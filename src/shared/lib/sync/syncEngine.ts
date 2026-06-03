import NetInfo from "@react-native-community/netinfo";
import { supabase } from "@/shared/lib/supabase";
import { encrypt, decrypt } from "@/shared/lib/encryption";
import { syncCategories } from "@/features/vault/api/categoryApi";
import {
  getPendingItems,
  markItemSynced,
  markItemFailed,
  upsertItemFromServer,
} from "@/features/vault/api/vaultApi";
import { getDb } from "@/shared/lib/database/db";

type SyncResult = {
  pushed: number;
  pulled: number;
  failed: number;
};

const pushPendingItems = async (userId: string): Promise<number> => {
  const pending = await getPendingItems(userId);
  let pushed = 0;

  for (const item of pending) {
    try {
      const payload = {
        user_id: item.user_id,
        title: item.title,
        category_id: item.category_id,
        is_favorite: item.is_favorite === 1,
        icon_type: item.icon_type,
        icon_value: item.icon_value,
        icon_color: item.icon_color,
        username: item.username ?? null,
        email: item.email ?? null,
        password: item.password ?? null,
        pin: item.pin ?? null,
        phone: item.phone ?? null,
        url: item.url ?? null,
        notes: item.notes ?? null,
        holder_name: item.holder_name ?? null,
        expired_date: item.expired_date ?? null,
        custom_fields: (() => {
          try { return JSON.parse(item.custom_fields || "[]"); } catch { return []; }
        })(),
        updated_at: new Date(item.updated_at).toISOString(),
      };

      if (item.is_deleted) {
        if (item.server_id) {
          await supabase.from("vault_items")
            .delete().eq("id", item.server_id);
        }
        const db = await getDb();
        await db.runAsync(
          "DELETE FROM vault_items WHERE id = ?", [item.id]
        );
      } else if (item.server_id) {
        await supabase.from("vault_items")
          .update(payload).eq("id", item.server_id);
        await markItemSynced(item.id, item.server_id);
      } else {
        const { data, error } = await supabase
          .from("vault_items")
          .insert(payload).select("id").single();
        if (error) throw error;
        await markItemSynced(item.id, data.id);
      }

      pushed++;
    } catch {
      await markItemFailed(item.id);
    }
  }

  return pushed;
};

const pullFromServer = async (userId: string): Promise<number> => {
  const db = await getDb();

  const lastSynced = await db.getFirstAsync<any>(
    `SELECT MAX(updated_at) as last FROM vault_items
     WHERE user_id = ? AND local_sync_status = 'synced'`,
    [userId]
  );

  const lastSync = lastSynced?.last
    ? new Date(lastSynced.last).toISOString()
    : new Date(0).toISOString();

  const { data, error } = await supabase
    .from("vault_items")
    .select("*")
    .eq("user_id", userId)
    .gt("updated_at", lastSync);

  if (error) throw error;
  if (!data?.length) return 0;

  for (const item of data) {
    await upsertItemFromServer(userId, item);
  }

  return data.length;
};

export const syncVault = async (userId: string): Promise<SyncResult> => {
  const net = await NetInfo.fetch();
  if (!net.isConnected) return { pushed: 0, pulled: 0, failed: 0 };

  try {
    await syncCategories(userId);
    const pushed = await pushPendingItems(userId);
    const pulled = await pullFromServer(userId);
    return { pushed, pulled, failed: 0 };
  } catch (e) {
    console.error("Sync error:", e);
    return { pushed: 0, pulled: 0, failed: 1 };
  }
};