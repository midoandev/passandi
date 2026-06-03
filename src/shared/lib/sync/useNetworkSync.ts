import { useEffect, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";
import { AppState } from "react-native";
import { useSyncStore } from "./syncStore";
import { useAuthStore } from "@/features/auth/model/authStore";

export function useNetworkSync() {
  const userId = useAuthStore((s) => s.user?.id);
  const startSync = useSyncStore((s) => s.startSync);
  const setOnline = useSyncStore((s) => s.setOnline);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!userId) return;

    // Monitor koneksi internet
    const unsubscribeNet = NetInfo.addEventListener((state) => {
      const isOnline = !!state.isConnected;
      setOnline(isOnline);

      // Saat kembali online setelah offline → auto sync
      if (isOnline && wasOffline.current) {
        wasOffline.current = false;
        startSync(userId);
      }

      if (!isOnline) {
        wasOffline.current = true;
      }
    });

    // Sync saat app kembali ke foreground
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && userId) {
        startSync(userId);
      }
    });

    // Initial sync saat hook mount
    startSync(userId);

    return () => {
      unsubscribeNet();
      subscription.remove();
    };
  }, [userId]);
}