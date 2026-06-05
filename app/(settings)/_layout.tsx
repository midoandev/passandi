import { Stack } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";

export default function SettingsLayout() {
  const { tokens } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: tokens.bg },
        animation: "fade",
      }}
    />
  );
}
