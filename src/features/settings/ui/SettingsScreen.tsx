import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useAuthStore } from "@/features/auth/model/authStore";
import { SettingRow, SettingGroup } from "./components/SettingRow";
import { resetAndSeed, clearRemoteVaultData, clearLocalVaultData }
  from "@/shared/lib/database/seeder";
import { useQueryClient } from "@tanstack/react-query";
import { VAULT_KEY } from "@/features/vault/model/useVaultQuery";
import { useState } from "react";

export function SettingsScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const [seeding, setSeeding] = useState(false);

  const userName = user?.user_metadata?.full_name
    ?? user?.email?.split("@")[0]
    ?? t("common.default_username");
  const userEmail = user?.email ?? "";


  const handleResetAndSeed = async () => {
    Alert.alert(
      "Reset & Seed Data",
      "Semua vault item akan dihapus (lokal + Supabase) lalu dibuat ulang dengan 25 data test. Lanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Reset & Seed",
          style: "destructive",
          onPress: async () => {
            setSeeding(true);
            try {
              const count = await resetAndSeed(userId);
              await queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) });
              Alert.alert("Selesai", `${count} akun test berhasil dibuat.`);
            } catch (e) {
              Alert.alert("Error", String(e));
            }
            setSeeding(false);
          },
        },
      ]
    );
  };

  // Handler hapus semua saja (tanpa seed)
  const handleClearAll = async () => {
    Alert.alert(
      "Hapus Semua Data Test",
      "Semua vault item akan dihapus dari lokal dan Supabase.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            setSeeding(true);
            try {
              await clearLocalVaultData(userId);
              await clearRemoteVaultData(userId);
              await queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) });
              Alert.alert("Selesai", "Semua data berhasil dihapus.");
            } catch (e) {
              Alert.alert("Error", String(e));
            }
            setSeeding(false);
          },
        },
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

        {/* Profile Card */}
        <TouchableOpacity
          onPress={() => router.push("/(settings)/profile")}
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
            <Text style={[styles.avatarText, { color: "#7A9CC4" }]}>
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
              {t("common.free_plan")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={tokens.border} />
        </TouchableOpacity>

        {/* Menu Groups */}
        <SettingGroup style={styles.menuGroup}>
          <SettingRow
            isFirst
            icon="settings-outline"
            iconBg={colors.brand.blue + "22"}
            iconColor={colors.brand.blue}
            title={t("settings.section_app")}
            onPress={() => router.push("/(settings)/application")}
          />
          <SettingRow
            icon="shield-checkmark-outline"
            iconBg="#8B5CF622"
            iconColor="#A78BFA"
            title={t("settings.section_security")}
            onPress={() => router.push("/(settings)/security")}
          />
          <SettingRow
            icon="person-outline"
            iconBg="#10B98122"
            iconColor="#34D399"
            title={t("settings.section_account")}
            onPress={() => router.push("/(settings)/account")}
          />
          <SettingRow
            icon="warning-outline"
            iconBg={colors.brand.danger + "22"}
            iconColor={colors.brand.danger}
            title={t("settings.section_danger")}
            isDanger
            onPress={() => router.push("/(settings)/danger")}
          />
          <SettingRow
            icon="help-circle-outline"
            iconBg="#06B6D422"
            iconColor="#22D3EE"
            title={t("settings.section_support")}
            onPress={() => router.push("/(settings)/support")}
          />
        </SettingGroup>

        {__DEV__ && (

          <SettingGroup style={styles.menuGroup}>
            <SettingRow
              icon="refresh-outline"
              iconBg="#8B5CF622"
              iconColor="#A78BFA"
              title={seeding ? "Memproses..." : "Reset & Seed 25 Data Test"}
              subtitle="Hapus semua → buat ulang dengan data dummy"
              onPress={seeding ? undefined : handleResetAndSeed}
            />
            <SettingRow
              icon="trash-outline"
              iconBg="#EF444422"
              iconColor="#EF4444"
              title="Hapus Semua Data Test"
              subtitle="Clear lokal + Supabase"
              onPress={seeding ? undefined : handleClearAll}
              isDanger
            />
          </SettingGroup>
        )}
        {/* App version kecil di bawah */}
        <Text style={[styles.version, { color: tokens.subtle }]}>
          Passandi · {t("settings.about_sub")}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 26, fontWeight: "600", marginBottom: 20 },

  profileCard: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 16, padding: 14,
    borderWidth: 0.5, gap: 12, marginBottom: 24,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 14,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "600" },
  profileBody: { flex: 1 },
  profileName: { fontSize: 15, fontWeight: "500" },
  profileEmail: { fontSize: 12, marginTop: 2 },
  planBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    borderRadius: 8, paddingHorizontal: 8,
    paddingVertical: 4, borderWidth: 0.5,
  },
  planText: { fontSize: 11, fontWeight: "500" },
  menuGroup: { marginBottom: 20 },
  version: { fontSize: 11, textAlign: "center", marginTop: 8 },
});