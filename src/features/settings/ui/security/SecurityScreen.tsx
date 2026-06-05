import { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { SettingRow, SettingGroup } from "../components/SettingRow";
import { OptionPickerModal } from "../components/OptionPickerModal";
import { useSettingsStore } from "../../model/settingsStore";
import { colors } from "@/shared/config/ThemeContext";

type ModalType = "autolock" | "clipboard" | null;

export function SecurityScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const {
    biometricEnabled, autoLock, clearClipboard,
    setBiometric, setAutoLock, setClearClipboard,
  } = useSettingsStore();

  const lockLabelMap: Record<string, string> = {
    immediately: t("settings.lock_immediately"),
    "1min": t("settings.lock_1min"),
    "5min": t("settings.lock_5min"),
    "15min": t("settings.lock_15min"),
    never: t("settings.lock_never"),
  };
  const clipLabelMap: Record<string, string> = {
    "15s": t("settings.clip_15s"),
    "30s": t("settings.clip_30s"),
    "60s": t("settings.clip_60s"),
    never: t("settings.clip_never"),
  };

  const handlePremium = () => {
    Alert.alert(
      t("settings.premium_feature"),
      "Fitur ini tersedia di Passandi Premium.",
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("settings.upgrade"), onPress: () => { } },
      ]
    );
  };

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title={t("settings.section_security")} />

      <SettingGroup style={styles.group}>
        <SettingRow
          isFirst
          icon="keypad-outline"
          iconBg="#8B5CF622"
          iconColor="#A78BFA"
          title={t("settings.change_pin")}
          onPress={() => router.push("/(settings)/security/change-pin")}
        />
        <SettingRow
          icon="finger-print-outline"
          iconBg="#8B5CF622"
          iconColor="#A78BFA"
          title={t("settings.biometric")}
          subtitle={t("settings.biometric_sub")}
          switchValue={biometricEnabled}
          onSwitch={setBiometric}
        />
        <SettingRow
          icon="shield-half-outline"
          iconBg="#8B5CF622"
          iconColor="#A78BFA"
          title={t("settings.two_factor")}
          subtitle={t("settings.two_factor_sub")}
          isPremium
          onPress={handlePremium}
        />
        <SettingRow
          icon="timer-outline"
          iconBg="#8B5CF622"
          iconColor="#A78BFA"
          title={t("settings.auto_lock")}
          subtitle={t("settings.auto_lock_sub")}
          rightText={lockLabelMap[autoLock]}
          onPress={() => setActiveModal("autolock")}
        />
        <SettingRow
          icon="clipboard-outline"
          iconBg="#8B5CF622"
          iconColor="#A78BFA"
          title={t("settings.clear_clipboard")}
          subtitle={t("settings.clear_clipboard_sub")}
          rightText={clipLabelMap[clearClipboard]}
          onPress={() => setActiveModal("clipboard")}
        />
      </SettingGroup>

      <OptionPickerModal
        visible={activeModal === "autolock"}
        title={t("settings.auto_lock")}
        selected={autoLock}
        options={[
          { label: t("settings.lock_immediately"), value: "immediately" },
          { label: t("settings.lock_1min"), value: "1min" },
          { label: t("settings.lock_5min"), value: "5min" },
          { label: t("settings.lock_15min"), value: "15min" },
          { label: t("settings.lock_never"), value: "never" },
        ]}
        onSelect={(v) => setAutoLock(v as any)}
        onClose={() => setActiveModal(null)}
      />
      <OptionPickerModal
        visible={activeModal === "clipboard"}
        title={t("settings.clear_clipboard")}
        selected={clearClipboard}
        options={[
          { label: t("settings.clip_15s"), value: "15s" },
          { label: t("settings.clip_30s"), value: "30s" },
          { label: t("settings.clip_60s"), value: "60s" },
          { label: t("settings.clip_never"), value: "never" },
        ]}
        onSelect={(v) => setClearClipboard(v as any)}
        onClose={() => setActiveModal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  group: { marginHorizontal: 20, marginTop: 16 },
});