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
import { AppBar } from "../../../shared/ui/AppBar";

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
      Alert.alert(t("common.error"), error.message, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [error?.id]);

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
      <AppBar title={t("auth.register")} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.registrationCard,
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
  registrationCard: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 48,
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
