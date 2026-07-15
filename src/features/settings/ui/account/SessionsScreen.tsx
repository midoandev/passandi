import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { ComingSoon } from "@/shared/ui";
import { useTranslation } from "react-i18next";

export function SessionsScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title={t("settings.active_sessions")} />

      <View style={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <ComingSoon
          icon="laptop-outline"
          title={t("sessions.coming_soon_title")}
          description={t("sessions.coming_soon_desc")}
          badge={t("sessions.coming_soon_badge")}
        >
          {/* Info saat ini */}
          <View style={[styles.infoBox, {
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
          }]}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={colors.brand.blue}
            />
            <Text style={[styles.infoText, { color: tokens.muted }]}>
              {t("sessions.info_text")}
            </Text>
          </View>
        </ComingSoon>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flex: 1,
  },
  infoBox: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 0.5,
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
