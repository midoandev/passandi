import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/shared/config/settingsStore";
import { router } from "expo-router";

type RowProps = {
  icon: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
};

function SettingRow({
  icon,
  iconBg,
  title,
  subtitle,
  onPress,
  right,
  danger,
}: RowProps) {
  const { tokens } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.row, { borderColor: tokens.border }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Text style={{ fontSize: 15 }}>{icon}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text
          style={[
            styles.rowTitle,
            { color: danger ? colors.brand.danger : tokens.text },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.rowSub, { color: tokens.subtle }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {right ??
        (onPress && !danger ? (
          <Text style={[styles.rowArrow, { color: tokens.subtle }]}>›</Text>
        ) : null)}
    </TouchableOpacity>
  );
}

type GroupProps = { children: React.ReactNode };
function SettingGroup({ children }: GroupProps) {
  const { tokens } = useTheme();
  return (
    <View
      style={[
        styles.group,
        {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        },
      ]}
    >
      {children}
    </View>
  );
}

export function SettingsScreen() {
  const { tokens, mode, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const { t } = useTranslation();
  const { language, setLanguage } = useSettingsStore();

  const handleSignOut = () => {
    Alert.alert(t("auth.logout"), t("auth.logout_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("auth.logout"),
        style: "destructive",
        onPress: () => {
          signOut();
          router.replace("/(app)/vault");
        },
      },
    ]);
  };

  const handleWipe = () => {
    Alert.alert(t("settings.wipe"), t("settings.wipe_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("settings.wipe"), style: "destructive", onPress: () => {} },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t("settings.delete_account"), t("settings.delete_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.delete_account"),
        style: "destructive",
        onPress: () => {},
      },
    ]);
  };

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={[styles.pageTitle, { color: tokens.text }]}>
          {t("settings.title")}
        </Text>

        {/* Profile Card */}
        <TouchableOpacity
          style={[
            styles.profileCard,
            {
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            },
          ]}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.profileAvatar,
              {
                backgroundColor: colors.brand.navy,
                borderColor: colors.brand.blue + "44",
              },
            ]}
          >
            <Text style={{ fontSize: 22 }}>👤</Text>
          </View>
          <View style={styles.profileBody}>
            <Text style={[styles.profileName, { color: tokens.text }]}>
              {user?.user_metadata?.full_name ?? "Pengguna"}
            </Text>
            <Text style={[styles.profileEmail, { color: tokens.subtle }]}>
              {user?.email ?? ""}
            </Text>
          </View>
          <Text style={[styles.rowArrow, { color: tokens.subtle }]}>›</Text>
        </TouchableOpacity>

        {/* Tampilan */}
        <Text style={[styles.sectionLabel, { color: tokens.subtle }]}>
          {t("settings.section_display")}
        </Text>
        <SettingGroup>
          <SettingRow
            icon={mode === "dark" ? "🌙" : "☀️"}
            iconBg={colors.brand.blue + "22"}
            title={t("settings.dark_mode")}
            right={
              <Switch
                value={mode === "dark"}
                onValueChange={toggle}
                trackColor={{ true: colors.brand.blue, false: tokens.border }}
                thumbColor="#fff"
              />
            }
          />
          <SettingRow
            icon="🌐"
            iconBg={colors.brand.blue + "22"}
            title={t("settings.language")}
            subtitle={language === "id" ? "Bahasa Indonesia" : "English"}
            onPress={() => setLanguage(language === "id" ? "en" : "id")}
          />
        </SettingGroup>

        {/* Keamanan */}
        <Text style={[styles.sectionLabel, { color: tokens.subtle }]}>
          Keamanan
        </Text>
        <SettingGroup>
          <SettingRow
            icon="👆"
            iconBg="#8B5CF622"
            title={t("settings.biometric")}
            subtitle={t("settings.biometric_sub")}
            right={
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ true: colors.brand.blue, false: tokens.border }}
                thumbColor="#fff"
              />
            }
          />
        </SettingGroup>

        {/* Lainnya */}
        <Text style={[styles.sectionLabel, { color: tokens.subtle }]}>
          {t("settings.section_other")}
        </Text>
        <SettingGroup>
          <SettingRow
            icon="ℹ️"
            iconBg={colors.brand.blue + "22"}
            title={t("settings.about")}
            subtitle="v1.0.0"
            onPress={() => {}}
          />
          <SettingRow
            icon="🚪"
            iconBg={colors.brand.gold + "22"}
            title={t("settings.logout")}
            onPress={handleSignOut}
          />
        </SettingGroup>

        {/* Danger Zone */}
        <Text style={[styles.sectionLabel, { color: tokens.subtle }]}>
          {t("settings.section_danger")}
        </Text>
        <SettingGroup>
          <SettingRow
            icon="🗑️"
            iconBg={colors.brand.danger + "22"}
            title={t("settings.wipe")}
            subtitle={t("settings.wipe_sub")}
            onPress={handleWipe}
            danger
          />
          <SettingRow
            icon="⚠️"
            iconBg={colors.brand.danger + "22"}
            title={t("settings.delete_account")}
            subtitle={t("settings.delete_account_sub")}
            onPress={handleDeleteAccount}
            danger
          />
        </SettingGroup>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pageTitle: {
    fontSize: 22,
    fontWeight: "500",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    gap: 12,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  profileBody: { flex: 1 },
  profileName: { fontSize: 15, fontWeight: "500", marginBottom: 3 },
  profileEmail: { fontSize: 12 },

  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  group: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderTopWidth: 0.5,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 14 },
  rowSub: { fontSize: 11, marginTop: 2 },
  rowArrow: { fontSize: 18 },
});
