import { useEffect } from "react";
import { getDb } from "@/shared/lib/database/db";
import { useSyncStore } from "./syncStore";
import { useAuthStore } from "@/features/auth/model/authStore";

export function usePendingCount() {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const setPending = useSyncStore((s) => s.setPending);

  useEffect(() => {
    if (!userId) return;

    const check = async () => {
      const db = await getDb();
      const row = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM vault_items
         WHERE user_id = ? AND local_sync_status IN ('pending','failed')`,
        [userId]
      );
      setPending(row?.count ?? 0);
    };

    check();
    const interval = setInterval(check, 5000); // cek tiap 5 detik
    return () => clearInterval(interval);
  }, [userId]);
}