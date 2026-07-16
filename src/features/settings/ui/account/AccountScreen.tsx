import { View, Alert, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { SettingRow, SettingGroup } from "../components/SettingRow";
import { useAuthStore } from "@/features/auth/model/authStore";
import { colors } from "@/shared/config/ThemeContext";
import { useIsPremium } from "@/features/premium";
import { exportVault } from "@/shared/lib/export/exportVault";

export function AccountScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const signOut = useAuthStore((s) => s.signOut);
  const isPremium = useIsPremium();

  const handleExport = async () => {
    if (!isPremium) {
      Alert.alert(
        t("settings.premium_feature"),
        t("settings.premium_feature_desc"),
        [
          { text: t("common.cancel"), style: "cancel" },
          { text: t("settings.upgrade"), onPress: () => router.push("/(premium)/paywall") },
        ]
      );
      return;
    }
    try {
      await exportVault("json");
      Alert.alert(t("common.success"), t("settings.export_success"));
    } catch (e: any) {
      Alert.alert(t("common.error"), e?.message ?? t("common.error"));
    }
  };

  const handleLogout = () => {
    Alert.alert(t("common.logout"), t("common.logout_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.logout"), style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title={t("settings.section_account")} />

      <SettingGroup style={styles.group}>
        <SettingRow
          isFirst
          icon="desktop-outline"
          iconBg="#10B98122"
          iconColor="#34D399"
          title={t("settings.active_sessions")}
          subtitle={t("settings.active_sessions_sub", { count: 1 })}
          onPress={() => router.push("/(settings)/account/sessions")}
        />
        <SettingRow
          icon="share-outline"
          iconBg="#10B98122"
          iconColor="#34D399"
          title={t("settings.export_data")}
          subtitle={t("settings.export_data_sub")}
          onPress={handleExport}
        />
        <SettingRow
          icon="log-out-outline"
          iconBg={colors.brand.gold + "22"}
          iconColor={colors.brand.gold}
          title={t("common.logout")}
          onPress={handleLogout}
        />
      </SettingGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  group: { marginHorizontal: 20, marginTop: 16 },
});
