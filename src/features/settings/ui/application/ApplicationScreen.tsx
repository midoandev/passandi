import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { SettingRow, SettingGroup } from "../components/SettingRow";
import { OptionPickerModal } from "../components/OptionPickerModal";
import { useSettingsStore } from "../../model/settingsStore";
import { colors } from "@/shared/config/ThemeContext";

type ModalType = "theme" | "language" | null;

export function ApplicationScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const {
    themeMode, language,
    notifEnabled,
    setThemeMode, setLanguage, setNotif,
  } = useSettingsStore();

  const themeLabelMap: Record<string, string> = {
    dark: t("settings.theme_dark"),
    light: t("settings.theme_light"),
    system: t("settings.theme_system"),
  };

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title={t("settings.section_app")} />

      <SettingGroup style={styles.group}>
        <SettingRow
          isFirst
          icon="moon-outline"
          iconBg={colors.brand.blue + "22"}
          iconColor={colors.brand.blue}
          title={t("settings.theme")}
          rightText={themeLabelMap[themeMode]}
          onPress={() => setActiveModal("theme")}
        />
        <SettingRow
          icon="language-outline"
          iconBg={colors.brand.blue + "22"}
          iconColor={colors.brand.blue}
          title={t("settings.language")}
          rightText={language === "id"
            ? t("settings.language_id")
            : t("settings.language_en")}
          onPress={() => setActiveModal("language")}
        />
        <SettingRow
          icon="notifications-outline"
          iconBg={colors.brand.blue + "22"}
          iconColor={colors.brand.blue}
          title={t("settings.notification")}
          subtitle={t("settings.notification_sub")}
          switchValue={notifEnabled}
          onSwitch={setNotif}
        />
      </SettingGroup>

      <OptionPickerModal
        visible={activeModal === "theme"}
        title={t("settings.theme")}
        selected={themeMode}
        options={[
          { label: t("settings.theme_dark"), value: "dark" },
          { label: t("settings.theme_light"), value: "light" },
          { label: t("settings.theme_system"), value: "system" },
        ]}
        onSelect={(v) => setThemeMode(v as any)}
        onClose={() => setActiveModal(null)}
      />
      <OptionPickerModal
        visible={activeModal === "language"}
        title={t("settings.language")}
        selected={language}
        options={[
          { label: t("settings.language_id"), value: "id" },
          { label: t("settings.language_en"), value: "en" },
        ]}
        onSelect={(v) => setLanguage(v as any)}
        onClose={() => setActiveModal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  group: { marginHorizontal: 20, marginTop: 16 },
});