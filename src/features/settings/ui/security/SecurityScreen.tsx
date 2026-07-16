import { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { SettingRow, SettingGroup } from "../components/SettingRow";
import { OptionPickerModal } from "../components/OptionPickerModal";
import { useSettingsStore } from "../../model/settingsStore";
import { useIsPremium } from "@/features/premium";
import { colors } from "@/shared/config/ThemeContext";
import { supabase } from "@/shared/lib/supabase";

type ModalType = "autolock" | "clipboard" | null;

export function SecurityScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const isPremium = useIsPremium();

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

  const handleTwoFactor = async () => {
    const { usePremiumStore } = await import("@/features/premium/model/premiumStore");
    if (!usePremiumStore.getState().isPremium()) {
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
    // Cek status 2FA dari server
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (data?.currentLevel === "aal2") {
      // Sudah aktif — disable
      Alert.alert(
        t("settings.two_factor"),
        t("settings.two_factor_already"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("common.ok"),
            style: "destructive",
            onPress: async () => {
              // Unenroll semua factor
              const factors = await supabase.auth.mfa.listFactors();
              for (const f of factors.data?.all ?? []) {
                await supabase.auth.mfa.unenroll({ factorId: f.id });
              }
              Alert.alert(t("common.success"), t("settings.two_factor_disabled"));
            },
          },
        ]
      );
    } else {
      // Belum aktif — mulai setup
      try {
        const { data: enrollment } = await supabase.auth.mfa.enroll({
          factorType: "totp",
        });
        if (!enrollment?.totp?.qr_code) throw new Error("No QR code");
        // Tampilkan QR code atau kode setup
        Alert.alert(
          t("settings.two_factor"),
          t("settings.two_factor_setup", { code: enrollment.totp.qr_code }),
          [
            { text: t("common.cancel"), style: "cancel" },
            {
              text: t("common.confirm"),
              onPress: async () => {
                const { data: challenge } = await supabase.auth.mfa.challenge({
                  factorId: enrollment.id,
                });
                if (challenge?.id) {
                  Alert.alert(
                    t("settings.two_factor"),
                    t("settings.two_factor_verify"),
                    [
                      { text: t("common.cancel"), style: "cancel" },
                      {
                        text: t("common.confirm"),
                        onPress: async () => {
                          Alert.alert(
                            t("common.success"),
                            t("settings.two_factor_activated")
                          );
                        },
                      },
                    ]
                  );
                }
              },
            },
          ]
        );
      } catch (e: any) {
        Alert.alert(t("common.error"), e?.message ?? t("common.error"));
      }
    }
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
          onSwitch={isPremium ? setBiometric : undefined}
          onPress={isPremium ? undefined : () => {
            Alert.alert(
              t("settings.premium_feature"),
              t("settings.premium_feature_desc"),
              [
                { text: t("common.cancel"), style: "cancel" },
                { text: t("settings.upgrade"), onPress: () => router.push("/(premium)/paywall") },
              ]
            );
          }}
        />
        <SettingRow
          icon="shield-half-outline"
          iconBg="#8B5CF622"
          iconColor="#A78BFA"
          title={t("settings.two_factor")}
          subtitle={t("settings.two_factor_sub")}
          isPremium
          onPress={handleTwoFactor}
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