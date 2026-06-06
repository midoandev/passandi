import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useAuthStore } from "@/features/auth/model/authStore";
import { router } from "expo-router";

// SplashScreen
// This component runs on app launch and decides where to navigate based on authentication state.
// It does NOT contain any business logic besides checking the auth store.
export default function SplashScreen() {
  const { tokens } = useTheme();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // If a user object exists, consider the user authenticated and go to the main app.
    // Otherwise, redirect to the authentication flow (unlock/login/register).
    if (user?.id) {
      router.replace("/(app)/vault");
    } else {
      router.replace("/(auth)/unlock");
    }
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: tokens.bg }]}>
      <ActivityIndicator size="large" color={colors.brand.blue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
