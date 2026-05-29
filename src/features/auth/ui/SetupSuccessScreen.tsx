import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppButton } from "@/shared/ui/AppButton";

export function SetupSuccessScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.flex,
        {
          backgroundColor: tokens.bg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.center}>
        <Text style={styles.emoji}>✅</Text>
        <Text style={[styles.title, { color: tokens.text }]}>
          {t("security.success_title")}
        </Text>
        <Text style={[styles.subtitle, { color: tokens.muted }]}>
          {t("security.success_subtitle")}
        </Text>
      </View>
      <AppButton
        label={t("security.btn_enter_vault")}
        onPress={() => router.replace("/(app)/vault")}
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingHorizontal: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emoji: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "500", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 22 },
  btn: {},
});
