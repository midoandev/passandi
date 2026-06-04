import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useSettingsStore } from "../model/settingsStore";
import { SettingRow, SettingGroup } from "./SettingRow";
import { OptionPickerModal } from "./OptionPickerModal";

type ModalType = "theme" | "language" | "autolock" | "clipboard" | null;

export function SettingsScreen() {
  const { t } = useTranslation();
  const { tokens, toggle, mode } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const wipeData = useAuthStore((s) => s.wipeData);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

  const {
    themeMode, language,
    biometricEnabled, notifEnabled,
    autoLock, clearClipboard,
    setThemeMode, setLanguage,
    setBiometric, setNotif,
    setAutoLock, setClearClipboard,
  } = useSettingsStore();

  const userName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Pengguna";
  const userEmail = user?.email ?? "";

  // Label helpers
  const themeLabelMap: Record<string, string> = {
    dark: t("settings.theme_dark"),
    light: t("settings.theme_light"),
    system: t("settings.theme_system"),
  };
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

  const handleLogout = () => {
    Alert.alert(t("settings.logout"), t("settings.logout_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("settings.logout"), style: "destructive", onPress: signOut },
    ]);
  };

  const handleWipe = () => {
    Alert.alert(t("settings.wipe_data"), t("settings.wipe_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.delete"), style: "destructive", onPress: wipeData },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t("settings.delete_account"), t("settings.delete_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: deleteAccount,
      },
    ]);
  };

  const handlePremiumFeature = () => {
    Alert.alert(
      t("settings.premium_feature"),
      "Fitur ini tersedia di Passandi Premium. Upgrade sekarang untuk akses penuh.",
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("settings.upgrade"), onPress: () => { } },
      ]
    );
  };

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 120,
        }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={[styles.pageTitle, { color: tokens.text }]}>
          {t("settings.title")}
        </Text>

        {/* ─── Profile Card ─── */}
        <TouchableOpacity
          onPress={() => router.push("/(app)/settings-profile")}
          activeOpacity={0.7}
          style={[styles.profileCard, {
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
          }]}
        >
          <View style={[styles.avatar, {
            backgroundColor: colors.brand.navy,
            borderColor: colors.brand.blue + "44",
          }]}>
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileBody}>
            <Text style={[styles.profileName, { color: tokens.text }]}>
              {userName}
            </Text>
            <Text style={[styles.profileEmail, { color: tokens.subtle }]}>
              {userEmail}
            </Text>
          </View>
          <View style={[styles.planBadge, {
            backgroundColor: colors.brand.gold + "22",
            borderColor: colors.brand.gold + "44",
          }]}>
            <Ionicons name="star-outline" size={11} color={colors.brand.gold} />
            <Text style={[styles.planText, { color: colors.brand.gold }]}>
              {t("settings.free_plan")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={tokens.border} />
        </TouchableOpacity>

        {/* ─── Pengaturan Aplikasi ─── */}
        <SettingGroup label={t("settings.section_app")} style={styles.group}>
          <SettingRow
            isFirst
            icon="🌙"
            iconBg={colors.brand.blue + "22"}
            title={t("settings.theme")}
            rightText={themeLabelMap[themeMode]}
            onPress={() => setActiveModal("theme")}
          />
          <SettingRow
            icon="🌐"
            iconBg={colors.brand.blue + "22"}
            title={t("settings.language")}
            rightText={language === "id"
              ? t("settings.language_id")
              : t("settings.language_en")}
            onPress={() => setActiveModal("language")}
          />
          <SettingRow
            icon="🔔"
            iconBg={colors.brand.blue + "22"}
            title={t("settings.notification")}
            subtitle={t("settings.notification_sub")}
            switchValue={notifEnabled}
            onSwitch={setNotif}
          />
        </SettingGroup>

        {/* ─── Keamanan ─── */}
        <SettingGroup label={t("settings.section_security")} style={styles.group}>
          <SettingRow
            isFirst
            icon="🔢"
            iconBg="#8B5CF622"
            title={t("settings.change_pin")}
            onPress={() => router.push("/(app)/settings-change-pin")}
          />
          <SettingRow
            icon="👆"
            iconBg="#8B5CF622"
            title={t("settings.biometric")}
            subtitle={t("settings.biometric_sub")}
            switchValue={biometricEnabled}
            onSwitch={setBiometric}
          />
          <SettingRow
            icon="🛡️"
            iconBg="#8B5CF622"
            title={t("settings.two_factor")}
            subtitle={t("settings.two_factor_sub")}
            isPremium
            onPress={handlePremiumFeature}
          />
          <SettingRow
            icon="⏱️"
            iconBg="#8B5CF622"
            title={t("settings.auto_lock")}
            subtitle={t("settings.auto_lock_sub")}
            rightText={lockLabelMap[autoLock]}
            onPress={() => setActiveModal("autolock")}
          />
          <SettingRow
            icon="📋"
            iconBg="#8B5CF622"
            title={t("settings.clear_clipboard")}
            subtitle={t("settings.clear_clipboard_sub")}
            rightText={clipLabelMap[clearClipboard]}
            onPress={() => setActiveModal("clipboard")}
          />
        </SettingGroup>

        {/* ─── Akun ─── */}
        <SettingGroup label={t("settings.section_account")} style={styles.group}>
          <SettingRow
            isFirst
            icon="💻"
            iconBg="#10B98122"
            title={t("settings.active_sessions")}
            subtitle={t("settings.active_sessions_sub", { count: 1 })}
            onPress={() => router.push("/(app)/settings-sessions")}
          />
          <SettingRow
            icon="📤"
            iconBg="#10B98122"
            title={t("settings.export_data")}
            subtitle={t("settings.export_data_sub")}
            isPremium
            onPress={handlePremiumFeature}
          />
          <SettingRow
            icon="🚪"
            iconBg={colors.brand.gold + "22"}
            title={t("settings.logout")}
            onPress={handleLogout}
          />
        </SettingGroup>

        {/* ─── Danger Zone ─── */}
        <SettingGroup label={t("settings.section_danger")} style={styles.group}>
          <SettingRow
            isFirst
            icon="🗑️"
            iconBg={colors.brand.danger + "22"}
            title={t("settings.wipe_data")}
            subtitle={t("settings.wipe_data_sub")}
            isDanger
            onPress={handleWipe}
          />
          <SettingRow
            icon="⚠️"
            iconBg={colors.brand.danger + "22"}
            title={t("settings.delete_account")}
            subtitle={t("settings.delete_account_sub")}
            isDanger
            onPress={handleDeleteAccount}
          />
        </SettingGroup>

        {/* ─── Support ─── */}
        <SettingGroup label={t("settings.section_support")} style={styles.group}>
          <SettingRow
            isFirst
            icon="💬"
            iconBg="#06B6D422"
            title={t("settings.contact_us")}
            subtitle={t("settings.contact_us_sub")}
            onPress={() => Linking.openURL("mailto:support@passandi.app")}
          />
          <SettingRow
            icon="📄"
            iconBg="#06B6D422"
            title={t("settings.terms")}
            onPress={() => Linking.openURL("https://passandi.app/terms")}
          />
          <SettingRow
            icon="🔏"
            iconBg="#06B6D422"
            title={t("settings.privacy")}
            onPress={() => Linking.openURL("https://passandi.app/privacy")}
          />
          <SettingRow
            icon="ℹ️"
            iconBg="#06B6D422"
            title={t("settings.about")}
            subtitle={t("settings.about_sub")}
            onPress={() => router.push("/(app)/settings-about")}
          />
        </SettingGroup>
      </ScrollView>

      {/* ─── Option Pickers ─── */}
      <OptionPickerModal
        visible={activeModal === "theme"}
        title={t("settings.theme")}
        selected={themeMode}
        options={[
          { label: t("settings.theme_dark"), value: "dark" },
          { label: t("settings.theme_light"), value: "light" },
          { label: t("settings.theme_system"), value: "system" },
        ]}
        onSelect={(val) => setThemeMode(val as any)}
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
        onSelect={(val) => setLanguage(val as any)}
        onClose={() => setActiveModal(null)}
      />

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
        onSelect={(val) => setAutoLock(val as any)}
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
        onSelect={(val) => setClearClipboard(val as any)}
        onClose={() => setActiveModal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 26, fontWeight: "600", marginBottom: 20 },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    gap: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 14,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "600", color: "#7A9CC4" },
  profileBody: { flex: 1 },
  profileName: { fontSize: 15, fontWeight: "500" },
  profileEmail: { fontSize: 12, marginTop: 2 },
  planBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 0.5,
  },
  planText: { fontSize: 11, fontWeight: "500" },
  group: { marginBottom: 24 },
});