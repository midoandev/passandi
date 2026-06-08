import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppButton, AppInput, AppBar } from "@/shared/ui";

import { useAuthStore } from "@/features/auth/model/authStore";

export function RegisterScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUpEmail = useAuthStore((s) => s.signUpEmail);
  const loading = useAuthStore((s) => s.loading);

  const validate = (): string | null => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword)
      return t("common.error_empty");
    if (password.length < 8) return t("common.error_min_length");
    if (password !== confirmPassword) return t("common.error_not_match");
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) {
      Alert.alert(t("common.error"), err);
      return;
    }

    const result = await signUpEmail(email.trim(), password, name.trim());

    if (!result.success) {
      Alert.alert(t("common.error"), result.error.message);
      return;
    }

    Alert.alert(t("common.success"), t("auth.register_success"), [
      { text: t("common.ok"), onPress: () => router.replace("/(auth)/login") },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: tokens.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* App Bar */}
      <AppBar title={t("auth.register")} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppInput
          label={t("common.name")}
          placeholder={t("auth.name_placeholder")}
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
        <AppInput
          label={t("common.email")}
          placeholder={t("auth.email_placeholder")}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <AppInput
          label={t("common.password")}
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
          style={styles.btn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  btn: { marginTop: 8 },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 4,
  },
  bottomText: { fontSize: 13 },
  bottomLink: { fontSize: 13 },
});
