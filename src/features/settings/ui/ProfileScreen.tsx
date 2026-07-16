import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { AppInput } from "@/shared/ui/AppInput";
import { AppButton } from "@/shared/ui/AppButton";
import { useAuthStore } from "@/features/auth/model/authStore";
import { supabase } from "@/shared/lib/supabase";
import { useIsPremium, useSubscriptionTier } from "@/features/premium";

export function ProfileScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(
    user?.user_metadata?.full_name ?? ""
  );
  const [loading, setLoading] = useState(false);

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    })
    : "-";

  const isPremium = useIsPremium();
  const tier = useSubscriptionTier();

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name.trim() },
      });
      if (error) throw error;
      Alert.alert(t("common.success"), t("profile.save_success"));
    } catch (e: any) {
      Alert.alert(t("common.error"), e?.message ?? t("common.error"));
    }
    setLoading(false);
  };

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title={t("profile.title")} />

      <ScrollView
        contentContainerStyle={[styles.scroll, {
          paddingBottom: insets.bottom + 40,
        }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarWrap, {
            backgroundColor: colors.brand.navy,
            borderColor: colors.brand.blue + "44",
          }]}>
            <Text style={styles.avatarText}>
              {(name || "P").charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.memberSince, { color: tokens.subtle }]}>
            {t("profile.member_since")} {memberSince}
          </Text>
        </View>

        {/* Form */}
        <View style={[styles.formCard, {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }]}>
          <AppInput
            label={t("common.name")}
            placeholder={t("profile.full_name_placeholder")}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          {/* Email — read only */}
          <View style={styles.emailWrap}>
            <Text style={[styles.emailLabel, { color: tokens.muted }]}>
              {t("common.email")}
            </Text>
            <View style={[styles.emailField, {
              backgroundColor: tokens.bg,
              borderColor: tokens.border,
            }]}>
              <Text style={[styles.emailValue, { color: tokens.subtle }]}>
                {user?.email ?? ""}
              </Text>
              <Ionicons name="lock-closed" size={14} color={tokens.border} />
            </View>
            <Text style={[styles.emailNote, { color: tokens.subtle }]}>
              {t("profile.email_note")}
            </Text>
          </View>

          <AppButton
            label={t("common.save")}
            onPress={handleSave}
            loading={loading}
            style={styles.saveBtn}
          />
        </View>

        {/* Plan Card */}
        <View style={[styles.planCard, {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }]}>
          <View style={styles.planHeader}>
            <View>
              <Text style={[styles.planLabel, { color: tokens.muted }]}>
                {t("profile.plan_title")}
              </Text>
              <Text style={[styles.planName, { color: tokens.text }]}>
                {isPremium ? t('common.premium') : t('common.free_plan')}
              </Text>
              <Text style={[styles.planSub, { color: tokens.subtle }]}>
                {isPremium ? t('profile.plan_premium_sub') : t('profile.plan_free_sub')}
              </Text>
            </View>
            <View style={[styles.planBadge, {
              backgroundColor: isPremium ? (colors.brand.gold + "22") : "#37415122",
              borderColor: isPremium ? (colors.brand.gold + "44") : "#37415144",
            }]}>
              <Ionicons
                name={isPremium ? "diamond" : "star-outline"}
                size={14}
                color={isPremium ? colors.brand.gold : "#6B7280"}
              />
              <Text style={[styles.planBadgeText, {
                color: isPremium ? colors.brand.gold : "#6B7280",
              }]}>
                {isPremium ? t('common.premium') : t('common.free_plan')}
              </Text>
            </View>
          </View>

          <View style={[styles.planDivider, { backgroundColor: tokens.border }]} />

          {/* Upgrade CTA */}
          <TouchableOpacity
            style={[styles.upgradeBtn, {
              backgroundColor: colors.brand.gold + "11",
              borderColor: colors.brand.gold + "33",
            }]}
            activeOpacity={0.8}
            onPress={() => router.push("/(premium)/paywall")}
          >
            <View>
              <Text style={[styles.upgradeTitle, { color: colors.brand.gold }]}>
                {t("profile.upgrade_btn")}
              </Text>
              <Text style={[styles.upgradeDesc, { color: tokens.subtle }]}>
                {t("profile.upgrade_desc")}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.brand.gold}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },

  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatarWrap: {
    width: 80, height: 80, borderRadius: 24,
    borderWidth: 1.5, alignItems: "center",
    justifyContent: "center", marginBottom: 10,
  },
  avatarText: { fontSize: 32, fontWeight: "600", color: "#7A9CC4" },
  memberSince: { fontSize: 12 },

  formCard: {
    borderRadius: 16, padding: 16,
    borderWidth: 0.5, marginBottom: 16,
  },
  emailWrap: { marginBottom: 16 },
  emailLabel: { fontSize: 11, letterSpacing: 0.5, marginBottom: 6 },
  emailField: {
    flexDirection: "row", alignItems: "center",
    height: 50, borderRadius: 12, borderWidth: 0.5,
    paddingHorizontal: 14, justifyContent: "space-between",
  },
  emailValue: { fontSize: 14, flex: 1 },
  emailNote: { fontSize: 11, marginTop: 4 },
  saveBtn: { marginTop: 4 },

  planCard: {
    borderRadius: 16, padding: 16,
    borderWidth: 0.5, marginBottom: 16,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  planLabel: { fontSize: 11, letterSpacing: 0.5, marginBottom: 4 },
  planName: { fontSize: 17, fontWeight: "600", marginBottom: 2 },
  planSub: { fontSize: 12 },
  planBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    borderRadius: 8, paddingHorizontal: 8,
    paddingVertical: 4, borderWidth: 0.5,
  },
  planBadgeText: { fontSize: 11, fontWeight: "500" },
  planDivider: { height: 0.5, marginVertical: 14 },
  upgradeBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12, padding: 14, borderWidth: 0.5,
  },
  upgradeTitle: { fontSize: 14, fontWeight: "500", marginBottom: 2 },
  upgradeDesc: { fontSize: 12 },
});