import {
  View, Text, ScrollView,
  StyleSheet, Linking, Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
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
          <Image
            source={require("../../../../../assets/images/icon.png")}
            style={styles.appIcon}
          />
          <Text style={[styles.appName, { color: tokens.text }]}>
            {t("common.app_name")}
          </Text>
          <Text style={[styles.tagline, { color: tokens.muted }]}>
            {t("common.tagline")}
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
          {/* <SettingRow
            isFirst
            icon="phone-portrait-outline"
            iconBg={colors.brand.blue + "22"}
            iconColor={colors.brand.blue}
            title={t("about.platform")}
            rightText={t("about.platform_val")}
          /> */}
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
    marginBottom: 14,
  },
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