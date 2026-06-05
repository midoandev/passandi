import "@/shared/lib/i18n";
import { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, router, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "@/shared/config/ThemeContext";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useSecurityStore } from "@/features/auth/model/securityStore";
import { useNetworkSync } from "@/shared/lib/sync/useNetworkSync";
import { usePendingCount } from "@/shared/lib/sync/usePendingCount";
import { useSettingsStore } from "@/features/settings/model/settingsStore";
import { Host } from "@expo/ui";


function AuthGate() {
  const initialized = useAuthStore((s) => s.initialized);
  const session = useAuthStore((s) => s.session);
  const user = useAuthStore((s) => s.user);
  const checkHasPin = useSecurityStore((s) => s.checkHasPin);
  const segments = useSegments();
  const isNavigating = useRef(false);

  const SECURITY_ROUTES = ["setup-pin", "unlock", "setup-success"];

  useEffect(() => {
    if (!initialized || isNavigating.current) return;

    const inAuthGroup = segments[0] === "(auth)";
    const currentRoute = (segments[1] as string) ?? "";
    const inSecurityRoute = SECURITY_ROUTES.includes(currentRoute);

    // Jangan interrupt security flow
    if (inSecurityRoute) return;

    const navigate = async () => {
      isNavigating.current = true;

      try {

        // Kondisi 1 — tidak ada session
        if (!session || !user) {
          if (!inAuthGroup) router.replace("/(auth)/login");
          return;
        }


        // Ada session → cek PIN untuk userId ini
        // Kondisi 2, 6, 9 — belum ada PIN
        // Kondisi 3, 4, 5 — sudah ada PIN
        const hasPin = await checkHasPin(user.id);

        if (!hasPin) {
          router.replace("/(auth)/setup-pin");
        } else {
          router.replace("/(auth)/unlock");
        }
      } finally {
        setTimeout(() => {
          isNavigating.current = false;
        }, 500);
      }
    };

    // Hanya jalankan saat di luar security routes
    if (!inSecurityRoute) navigate();
  }, [session, initialized]);

  return null;
}

function SyncProvider() {
  useNetworkSync();
  usePendingCount();
  return null;
}

function AppStatusBar() {
  const { mode } = useTheme();
  return <StatusBar style={mode === "dark" ? "light" : "dark"} />;
}

const queryClient = new QueryClient();

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const initSettings = useSettingsStore((s) => s.init);  // ← tambah

  useEffect(() => {
    initialize();
    initSettings();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthGate />
          <AppStatusBar />
          <SyncProvider />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
