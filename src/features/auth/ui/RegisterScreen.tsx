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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppInput } from "@/shared/ui/AppInput";
import { AppButton } from "@/shared/ui/AppButton";
import { colors } from "@/shared/config/ThemeContext";
import { useAuthStore } from "@/features/auth/model/authStore";

export function RegisterScreen() {
  const { t } = useTranslation();
  const { tokens, toggle, mode } = useTheme();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signUpEmail, loading, error, clearError } = useAuthStore();

  useEffect(() => {
    if (error) {
      Alert.alert(t("common.error"), error, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [error]);

  const validate = (): string | null => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return t("auth.error_empty");
    }
    if (password.length < 8) return t("auth.error_password_length");
    if (password !== confirmPassword) return t("auth.error_password_match");
    return null;
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert(t("common.error"), validationError);
      return;
    }
    await signUpEmail(email.trim(), password, name.trim());
    Alert.alert(t("common.success"), t("auth.register_success"), [
      { text: "OK", onPress: () => router.replace("/(auth)/login") },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: tokens.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header dengan Back Button */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              {
                backgroundColor: tokens.surface,
                borderColor: tokens.border,
              },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={{ color: tokens.text, fontSize: 18 }}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggle}>
            <Text style={{ color: tokens.muted }}>
              {mode === "dark" ? "☀️" : "🌙"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Top Section */}
        <View style={styles.topSection}>
          <View
            style={[
              styles.logoWrap,
              {
                backgroundColor: colors.brand.navy,
                borderColor: colors.brand.blue + "44",
              },
            ]}
          >
            <Text style={styles.logoIcon}>🔐</Text>
          </View>
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
            {t("auth.register")}
          </Text>

          <AppInput
            label={t("auth.name")}
            placeholder={t("auth.name_placeholder")}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />

          <AppInput
            label={t("auth.email")}
            placeholder={t("auth.email_placeholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <AppInput
            label={t("auth.password")}
            placeholder={t("auth.password_placeholder")}
            isPassword
            value={password}
            onChangeText={setPassword}
          />

          <AppInput
            label={t("auth.confirm_password")}
            placeholder={t("auth.confirm_password_placeholder")}
            isPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <AppButton
            label={t("auth.btn_register")}
            onPress={handleRegister}
            loading={loading}
            style={styles.btnPrimary}
          />

          {/* Go to Login */}
          <View style={styles.bottomRow}>
            <Text style={[styles.bottomText, { color: tokens.subtle }]}>
              {t("auth.have_account")}
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/login")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.bottomLink, { color: colors.brand.blue }]}>
                {t("auth.go_login")}
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },

  topSection: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 28,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  logoIcon: { fontSize: 28 },
  appName: {
    fontSize: 24,
    fontWeight: "500",
    letterSpacing: 2,
    marginBottom: 4,
  },
  tagline: { fontSize: 12 },

  card: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 48,
    borderTopWidth: 0.5,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  btnPrimary: { marginTop: 8 },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 4,
  },
  bottomText: { fontSize: 13 },
  bottomLink: { fontSize: 13 },
});
