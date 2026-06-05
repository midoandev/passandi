import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet, Linking, Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { SettingRow, SettingGroup } from "../components/SettingRow";

const APP_VERSION = "1.0.0";
const BUILD = "1";

export function AboutScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title={t("about.title")} />

      <ScrollView
        contentContainerStyle={[styles.scroll, {
          paddingBottom: insets.bottom + 40,
        }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.appIcon, {
            backgroundColor: colors.brand.navy,
            borderColor: colors.brand.blue + "44",
          }]}>
            <Text style={styles.appIconText}>🔐</Text>
          </View>
          <Text style={[styles.appName, { color: tokens.text }]}>
            {t("about.app_name")}
          </Text>
          <Text style={[styles.tagline, { color: tokens.muted }]}>
            {t("about.tagline")}
          </Text>
          <View style={[styles.versionBadge, {
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
          }]}>
            <Text style={[styles.versionText, { color: tokens.subtle }]}>
              v{APP_VERSION} · Build {BUILD}
            </Text>
          </View>
        </View>

        {/* Deskripsi */}
        <View style={[styles.descCard, {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }]}>
          <Text style={[styles.descText, { color: tokens.muted }]}>
            {t("about.description")}
          </Text>
        </View>

        {/* Info Aplikasi */}
        <SettingGroup
          label={t("about.section_info")}
          style={styles.group}
        >
          <SettingRow
            isFirst
            icon="phone-portrait-outline"
            iconBg={colors.brand.blue + "22"}
            iconColor={colors.brand.blue}
            title={t("about.platform")}
            rightText={t("about.platform_val")}
          />
          <SettingRow
            icon="code-slash-outline"
            iconBg={colors.brand.blue + "22"}
            iconColor={colors.brand.blue}
            title={t("about.version")}
            rightText={APP_VERSION}
          />
          <SettingRow
            icon="construct-outline"
            iconBg={colors.brand.blue + "22"}
            iconColor={colors.brand.blue}
            title={t("about.build")}
            rightText={BUILD}
          />
          <SettingRow
            icon="newspaper-outline"
            iconBg={colors.brand.blue + "22"}
            iconColor={colors.brand.blue}
            title={t("about.changelog")}
            onPress={() => Linking.openURL("https://passandi.app/changelog")}
          />
          <SettingRow
            icon="cube-outline"
            iconBg={colors.brand.blue + "22"}
            iconColor={colors.brand.blue}
            title={t("about.open_source")}
            onPress={() => Linking.openURL("https://passandi.app/licenses")}
          />
        </SettingGroup>

        {/* Legal */}
        <SettingGroup
          label={t("about.section_legal")}
          style={styles.group}
        >
          <SettingRow
            isFirst
            icon="document-text-outline"
            iconBg="#06B6D422"
            iconColor="#22D3EE"
            title={t("settings.terms")}
            onPress={() => Linking.openURL("https://passandi.app/terms")}
          />
          <SettingRow
            icon="lock-closed-outline"
            iconBg="#06B6D422"
            iconColor="#22D3EE"
            title={t("settings.privacy")}
            onPress={() => Linking.openURL("https://passandi.app/privacy")}
          />
        </SettingGroup>

        {/* Made with love */}
        <Text style={[styles.madeWith, { color: tokens.subtle }]}>
          {t("about.made_with")}
        </Text>

        {/* Tech Stack */}
        <View style={styles.techRow}>
          {["Expo", "React Native", "Supabase", "TypeScript"].map((tech) => (
            <View key={tech} style={[styles.techBadge, {
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            }]}>
              <Text style={[styles.techText, { color: tokens.muted }]}>
                {tech}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },

  hero: { alignItems: "center", marginBottom: 24 },
  appIcon: {
    width: 88, height: 88, borderRadius: 24,
    borderWidth: 1.5, alignItems: "center",
    justifyContent: "center", marginBottom: 14,
  },
  appIconText: { fontSize: 40 },
  appName: { fontSize: 26, fontWeight: "600", marginBottom: 6 },
  tagline: { fontSize: 13, marginBottom: 12 },
  versionBadge: {
    borderRadius: 20, paddingHorizontal: 14,
    paddingVertical: 5, borderWidth: 0.5,
  },
  versionText: { fontSize: 12 },

  descCard: {
    borderRadius: 14, padding: 16,
    borderWidth: 0.5, marginBottom: 24,
  },
  descText: { fontSize: 13, lineHeight: 22 },

  group: { marginBottom: 20 },

  madeWith: { fontSize: 12, textAlign: "center", marginBottom: 12 },
  techRow: {
    flexDirection: "row", flexWrap: "wrap",
    gap: 8, justifyContent: "center", marginBottom: 24,
  },
  techBadge: {
    borderRadius: 8, paddingHorizontal: 10,
    paddingVertical: 4, borderWidth: 0.5,
  },
  techText: { fontSize: 11 },
});