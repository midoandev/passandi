import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { useTranslation } from "react-i18next";
import { supabase } from "@/shared/lib/supabase";

export function SessionsScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [sessionCreated, setSessionCreated] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.created_at) {
        setSessionCreated(new Date(data.session.created_at).toLocaleDateString());
      }
    });
  }, []);

  const handleLogoutOthers = () => {
    Alert.alert(
      t("sessions.revoke_title"),
      t("sessions.revoke_confirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("sessions.revoke_btn"),
          style: "destructive",
          onPress: async () => {
            try {
              await supabase.auth.signOut({ scope: "others" });
              Alert.alert(t("common.success"), t("sessions.revoke_success"));
            } catch {
              Alert.alert(t("common.error"), t("common.error"));
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title={t("settings.active_sessions")} />

      <View style={[styles.content, { paddingBottom: insets.bottom + 40 }]}>

        {/* Current Session Card */}
        <View style={[styles.card, {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }]}>
          <View style={[styles.iconWrap, {
            backgroundColor: colors.brand.blue + "22",
          }]}>
            <Ionicons name="phone-portrait-outline" size={28} color={colors.brand.blue} />
          </View>
          <Text style={[styles.deviceLabel, { color: tokens.subtle }]}>
            {t("sessions.current_device")}
          </Text>
          <Text style={[styles.deviceName, { color: tokens.text }]}>
            {t("sessions.this_device")}
          </Text>
          {sessionCreated ? (
            <Text style={[styles.sessionDate, { color: tokens.muted }]}>
              {t("sessions.since_date", { date: sessionCreated })}
            </Text>
          ) : null}
          <View style={[styles.activeBadge, {
            backgroundColor: "#10B981" + "22",
          }]}>
            <View style={styles.activeDot} />
            <Text style={[styles.activeText, { color: "#10B981" }]}>
              {t("sessions.active")}
            </Text>
          </View>
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }]}>
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={colors.brand.blue}
          />
          <Text style={[styles.infoText, { color: tokens.muted }]}>
            {t("sessions.info_text")}
          </Text>
        </View>

        {/* Revoke Others */}
        <TouchableOpacity
          style={[styles.revokeBtn, {
            backgroundColor: colors.brand.danger + "11",
            borderColor: colors.brand.danger + "33",
          }]}
          onPress={handleLogoutOthers}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.brand.danger} />
          <Text style={[styles.revokeText, { color: colors.brand.danger }]}>
            {t("sessions.revoke_others")}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
    gap: 16,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  deviceLabel: { fontSize: 11, letterSpacing: 1, textTransform: "uppercase" },
  deviceName: { fontSize: 16, fontWeight: "600" },
  sessionDate: { fontSize: 12 },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  activeText: { fontSize: 12, fontWeight: "600" },
  infoBox: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 0.5,
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
  revokeBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 0.5,
    marginTop: 8,
  },
  revokeText: { fontSize: 14, fontWeight: "600" },
});
