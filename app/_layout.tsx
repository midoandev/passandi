import "react-native-gesture-handler";
import "@/shared/lib/i18n";
import { useEffect, useRef } from "react";
import { initSentry, setUser, clearUser, logError } from "@/shared/lib/sentry";
import { initAnalytics, identifyUser, resetAnalytics, trackEvent } from "@/shared/lib/analytics";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, router, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider, useTheme } from "@/shared/config/ThemeContext";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useSecurityStore } from "@/features/auth/model/securityStore";
import { useNetworkSync } from "@/shared/lib/sync/useNetworkSync";
import { usePendingCount } from "@/shared/lib/sync/usePendingCount";
import { usePremiumStore } from "@/features/premium";
import { useSettingsStore } from "@/features/settings/model/settingsStore";
import { getDb } from "@/shared/lib/database/db";

// Prevent native splash from hiding until we're ready
SplashScreen.preventAutoHideAsync();

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

    if (inSecurityRoute) return;

    const navigate = async () => {
      isNavigating.current = true;

      try {
        if (!session || !user) {
          clearUser();
          resetAnalytics();
          if (!inAuthGroup) router.replace("/(auth)/login");
          return;
        }

        setUser(user.id, user.email);
        identifyUser(user.id, { email: user.email });
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

    if (!inSecurityRoute) navigate();
  }, [session, initialized]);

  return null;
}

function PremiumProvider() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const checkPremiumStatus = usePremiumStore((s) => s.checkPremiumStatus);
  const handlePurchaseResult = usePremiumStore((s) => s.handlePurchaseResult);

  useEffect(() => {
    if (initialized && user) {
      checkPremiumStatus(user.id);
    }
  }, [initialized, user]);

  useEffect(() => {
    if (!user) return;

    let cleanup: () => void = () => { };

    (async () => {
      const mod = await import('@/shared/lib/iap/iapManager');
      const ready = await mod.ensureConnected();
      if (!ready.success) return;
      cleanup = mod.onPurchaseUpdate((purchase: any) => {
        handlePurchaseResult(purchase, user.id);
      });
    })();

    return () => {
      cleanup?.();
    };
  }, [user]);

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
  const initSettings = useSettingsStore((s) => s.init);

  useEffect(() => {
    initSentry();
    initAnalytics();
    trackEvent("app_open");

    const boot = async () => {
      try {
        await getDb();        // 1. init SQLite
        await initialize();   // 2. init auth session
        await initSettings(); // 3. init settings
      } catch (e) {
        logError(e as Error, { context: "boot" });
      } finally {
        await SplashScreen.hideAsync(); // 4. hide native splash
      }
    };
    boot();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppStatusBar />
          <AuthGate />
          <PremiumProvider />
          <SyncProvider />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
