import type { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useTranslation } from "react-i18next";
import type { IoniconsName } from "@/shared/lib/iconTypes";

type ComingSoonProps = {
  icon?: IoniconsName;
  title: string;
  description?: string;
  badge?: string;
  children?: ReactNode;
};

export function ComingSoon({
  icon = "time-outline",
  title,
  description,
  badge,
  children,
}: ComingSoonProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.card, {
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
      }]}>
        <View style={[styles.iconWrap, {
          backgroundColor: colors.brand.blue + "22",
        }]}>
          <Ionicons name={icon} size={32} color={colors.brand.blue} />
        </View>

        <Text style={[styles.title, { color: tokens.text }]}>
          {title}
        </Text>

        {description && (
          <Text style={[styles.desc, { color: tokens.muted }]}>
            {description}
          </Text>
        )}

        <View style={[styles.badge, { backgroundColor: colors.brand.blue + "22" }]}>
          <Ionicons name="time-outline" size={13} color={colors.brand.blue} />
          <Text style={[styles.badgeText, { color: colors.brand.blue }]}>
            {badge ?? t("common.coming_soon")}
          </Text>
        </View>
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  desc: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 22,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
});
