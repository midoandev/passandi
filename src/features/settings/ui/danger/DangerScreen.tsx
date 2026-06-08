import { View, Text, Alert, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { SettingRow, SettingGroup } from "../components/SettingRow";
import { useAuthStore } from "@/features/auth/model/authStore";
import { colors } from "@/shared/config/ThemeContext";

export function DangerScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const wipeData = useAuthStore((s) => s.wipeData);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

  const handleWipe = () => {
    Alert.alert(t("settings.wipe_data"), t("settings.wipe_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.delete"), style: "destructive", onPress: wipeData },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(t("settings.delete_account"), t("settings.delete_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.delete"), style: "destructive", onPress: deleteAccount },
    ]);
  };

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title={t("settings.section_danger")} />

      {/* Warning Banner */}
      <View style={[styles.banner, {
        backgroundColor: colors.brand.danger + "11",
        borderColor: colors.brand.danger + "33",
      }]}>
        <Text style={[styles.bannerText, { color: colors.brand.danger }]}>
          {t("settings.danger_warning")}
        </Text>
      </View>

      <SettingGroup style={styles.group}>
        <SettingRow
          isFirst
          icon="trash-outline"
          iconBg={colors.brand.danger + "22"}
          iconColor={colors.brand.danger}
          title={t("settings.wipe_data")}
          subtitle={t("settings.wipe_data_sub")}
          isDanger
          onPress={handleWipe}
        />
        <SettingRow
          icon="alert-circle-outline"
          iconBg={colors.brand.danger + "22"}
          iconColor={colors.brand.danger}
          title={t("settings.delete_account")}
          subtitle={t("settings.delete_account_sub")}
          isDanger
          onPress={handleDelete}
        />
      </SettingGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  banner: {
    marginHorizontal: 20, marginTop: 16,
    borderRadius: 12, padding: 14, borderWidth: 0.5,
    marginBottom: 4,
  },
  bannerText: { fontSize: 13, lineHeight: 20 },
  group: { marginHorizontal: 20, marginTop: 12 },
});