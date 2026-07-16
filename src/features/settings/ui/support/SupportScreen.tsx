import { View, StyleSheet, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { SettingRow, SettingGroup } from "../components/SettingRow";

export function SupportScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title={t("settings.section_support")} />

      <SettingGroup style={styles.group}>
        <SettingRow
          isFirst
          icon="mail-outline"
          iconBg="#06B6D422"
          iconColor="#22D3EE"
          title={t("settings.contact_us")}
          subtitle={t("settings.contact_us_sub")}
          onPress={() => Linking.openURL("mailto:support@passandi.app")}
        />
        <SettingRow
          icon="document-text-outline"
          iconBg="#06B6D422"
          iconColor="#22D3EE"
          title={t("settings.terms")}
          onPress={() => Linking.openURL("https://mido.github.io/passandi-web/#terms")}
        />
        <SettingRow
          icon="lock-closed-outline"
          iconBg="#06B6D422"
          iconColor="#22D3EE"
          title={t("settings.privacy")}
          onPress={() => Linking.openURL("https://mido.github.io/passandi-web/#privacy")}
        />
        <SettingRow
          icon="information-circle-outline"
          iconBg="#06B6D422"
          iconColor="#22D3EE"
          title={t("settings.about")}
          subtitle={t("settings.about_sub")}
          onPress={() => router.push("/(settings)/support/about")}
        />
      </SettingGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  group: { marginHorizontal: 20, marginTop: 16 },
});