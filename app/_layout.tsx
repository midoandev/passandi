import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, router, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "@/shared/config/ThemeContext";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useSecurityStore } from "@/features/auth/model/securityStore";
import "@/shared/lib/i18n";
const SETUP_ROUTES = ["setup-pin", "setup-success"];

function AuthGate() {
  const initialized = useAuthStore((state) => state.initialized);
  const session = useAuthStore((state) => state.session);
  const checkIsSetup = useSecurityStore((state) => state.checkIsSetup);
  const segment = useSegments();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segment[0] === "(auth)";
    const currentRoute = segment[1] as string;
    const inSetupFlow = SETUP_ROUTES.includes(currentRoute);

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (session && inSetupFlow) return;

    if (session && inAuthGroup) {
      checkIsSetup().then((isSetup) => {
        if (isSetup) {
          router.replace("/(app)/vault");
        } else {
          router.replace("/(auth)/setup-pin");
        }
      });
    }
  }, [session, initialized, segment]);

  return null;
}

function AppStatusBar() {
  const { mode } = useTheme();
  return <StatusBar style={mode === "dark" ? "light" : "dark"} />;
}

const queryClient = new QueryClient();

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthGate />
          <AppStatusBar />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
