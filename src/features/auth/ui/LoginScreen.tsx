import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppButton, AppInput } from "@/shared/ui";
import { colors } from "@/shared/config/ThemeContext";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

export function LoginScreen() {
  const { tokens, toggle, mode } = useTheme();
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInEmail = useAuthStore((state) => state.signInEmail);
  const signInGoogle = useAuthStore((state) => state.signInGoogle);
  const loading = useAuthStore((state) => state.loading);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert(t("common.info"), t("common.error_empty"), [{ text: t("common.ok") }]);
      return;
    }

    const result = await signInEmail(email, password);

    if (!result.success) {
      Alert.alert(t("common.error"), result.error.message);
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.flex,
        { backgroundColor: tokens.bg, paddingTop: insets.top },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Theme Toggle */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggle}>
          <Text style={[styles.themeIcon, { color: tokens.muted }]}>
            {mode === "dark" ? "☀️" : "🌙"}
          </Text>
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.topSection}>
          <Image
            style={styles.logoWrap}
            source={require("../../../../assets/images/icon.png")}
          />

          <Text style={[styles.appName, { color: tokens.text }]}>
            {t("common.app_name")}
          </Text>
          <Text style={[styles.tagline, { color: tokens.muted }]}>
            {t("common.tagline")}
          </Text>
        </View>

        {/* Form Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: tokens.muted }]}>
            {t("auth.login")}
          </Text>

          <AppInput
            label={t("common.email")}
            placeholder={t("auth.email_placeholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            iconName="mail-outline"
          />

          <AppInput
            label={t("common.password")}
            placeholder={t("auth.password_placeholder")}
            isPassword
            value={password}
            onChangeText={setPassword}
            iconName="lock-closed-outline"
          />

          <AppButton
            label={t("auth.btn_login")}
            onPress={handleSubmit}
            loading={loading}
            style={styles.btnPrimary}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View
              style={[styles.dividerLine, { backgroundColor: tokens.border }]}
            />
            <Text style={[styles.dividerText, { color: tokens.subtle }]}>
              {t("common.or")}
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: tokens.border }]}
            />
          </View>

          {/* Google Button */}
          <AppButton
            label={t("auth.btn_google")}
            onPress={signInGoogle}
            loading={loading}
            variant="outline"

          />

          {/* Toggle Register/Login */}
          <View style={styles.registerRow}>
            <Text style={[styles.registerText, { color: tokens.subtle }]}>
              {t("auth.no_account")}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={[styles.registerLink, { color: colors.brand.blue }]}>
                {t("auth.go_register")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  themeToggle: { position: "absolute", right: 24, zIndex: 10 },
  topSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingBottom: 32,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "500",
    letterSpacing: 2,
    marginBottom: 6,
  },
  tagline: { fontSize: 13 },
  card: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    borderTopWidth: 0.5,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  btnPrimary: { marginTop: 8, marginBottom: 16 },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: { fontSize: 11 },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 4,
  },
  registerText: { fontSize: 13 },
  registerLink: { fontSize: 13 },
  themeIcon: { fontSize: 18 },
});
