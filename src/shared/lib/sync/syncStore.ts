import { create } from "zustand";
import NetInfo from "@react-native-community/netinfo";
import { syncVault } from "./syncEngine";

type SyncStatus = "idle" | "syncing" | "success" | "error" | "offline";

type SyncState = {
  status: SyncStatus;
  lastSyncAt: Date | null;
  pendingCount: number;
  isOnline: boolean;

  startSync: (userId: string) => Promise<void>;
  setOnline: (online: boolean) => void;
  setPending: (count: number) => void;
};

export const useSyncStore = create<SyncState>((set, get) => ({
  status: "idle",
  lastSyncAt: null,
  pendingCount: 0,
  isOnline: true,

  setOnline: (online) => set({ isOnline: online }),
  setPending: (count) => set({ pendingCount: count }),

  startSync: async (userId) => {
    if (get().status === "syncing") return;

    set({ status: "syncing" });

    const result = await syncVault(userId);

    if (result.failed > 0) {
      set({ status: "error" });
    } else {
      set({ status: "success", lastSyncAt: new Date() });
    }

    // Reset ke idle setelah 3 detik
    setTimeout(() => set({ status: "idle" }), 3000);
  },
}));