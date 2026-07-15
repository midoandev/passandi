import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { SafeAreaView } from "react-native-safe-area-context";

type MaintenanceScreenProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function MaintenanceScreen({
  title,
  message,
  onRetry,
}: MaintenanceScreenProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title={title ?? t("maintenance.title")} showBack={false} />

      <View style={styles.center}>
        <View style={[styles.card, {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }]}>
          <View style={[styles.iconWrap, {
            backgroundColor: colors.brand.blue + "22",
          }]}>
            <Ionicons name="construct-outline" size={40} color={colors.brand.blue} />
          </View>

          <Text style={[styles.title, { color: tokens.text }]}>
            {title ?? t("maintenance.title")}
          </Text>

          <Text style={[styles.desc, { color: tokens.muted }]}>
            {message ?? t("maintenance.message")}
          </Text>

          {onRetry ? (
            <TouchableOpacity
              onPress={onRetry}
              activeOpacity={0.7}
              style={[styles.retryBtn, {
                backgroundColor: colors.brand.blue,
              }]}
            >
              <Ionicons name="refresh-outline" size={16} color="#fff" />
              <Text style={styles.retryText}>{t("maintenance.retry")}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 80,
    height: 80,
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
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
