import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useSecurityStore } from "@/features/auth/model/securityStore";
import { useAuthStore } from "@/features/auth/model/authStore";

const PIN_LENGTH = 6;
const NUMPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export function UnlockScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const signOut = useAuthStore((s) => s.signOut);
  const user = useAuthStore((s) => s.user);
  const verifyPin = useSecurityStore((s) => s.verifyPin);

  // Cek biometrik tersedia
  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then((has) => {
      if (has)
        LocalAuthentication.isEnrolledAsync().then(setBiometricAvailable);
    });
  }, []);

  // Auto verify saat PIN penuh
  useEffect(() => {
    if (pin.length === PIN_LENGTH) handleVerify(pin);
  }, [pin]);

  const handleVerify = async (inputPin: string) => {
    if (!user?.id) return;
    const valid = await verifyPin(user.id, inputPin);
    if (valid) {
      router.replace("/(app)/vault");
    } else {
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleBiometric = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t("unlock.biometric_prompt"),
      fallbackLabel: t("unlock.use_pin"),
      cancelLabel: t("unlock.cancel"),
    });
    if (result.success) router.replace("/(app)/vault");
  };

  const handlePress = (val: string) => {
    if (val === "⌫") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (val === "" || pin.length >= PIN_LENGTH) return;
    setPin((p) => p + val);
  };

  const handleSignOut = () => {
    Alert.alert(t("auth.logout"), t("auth.logout_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("auth.logout"), style: "destructive", onPress: signOut },
    ]);
  };

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "";

  return (
    <View
      style={[
        styles.flex,
        {
          backgroundColor: tokens.bg,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
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
        <Text style={[styles.greeting, { color: tokens.muted }]}>
          {t("unlock.greeting", { name: firstName })}
        </Text>
        <Text style={[styles.title, { color: tokens.text }]}>
          {t("unlock.title")}
        </Text>
      </View>

      {/* PIN Dots */}
      <View style={[styles.dotsWrap, shake && styles.shake]}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i < pin.length ? colors.brand.blue : "transparent",
                borderColor: i < pin.length ? colors.brand.blue : tokens.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Numpad */}
      <View style={styles.numpad}>
        {NUMPAD.map((val, i) => {
          const isEmpty = val === "";
          const isDel = val === "⌫";
          const isNum = !isEmpty && !isDel;

          return (
            <TouchableOpacity
              key={i}
              onPress={() => handlePress(val)}
              activeOpacity={isEmpty ? 1 : 0.6}
              style={[
                styles.numBtn,
                isNum && {
                  backgroundColor: tokens.surface,
                  borderColor: tokens.border,
                },
                isEmpty && styles.numBtnEmpty,
              ]}
            >
              <Text
                style={[
                  styles.numText,
                  isDel && { color: tokens.muted, fontSize: 20 },
                  isNum && { color: tokens.text },
                ]}
              >
                {val}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Biometrik */}
      {biometricAvailable && (
        <TouchableOpacity onPress={handleBiometric} style={styles.biometricBtn}>
          <Text style={styles.biometricIcon}>👆</Text>
          <Text style={[styles.biometricText, { color: tokens.muted }]}>
            {t("unlock.use_biometric")}
          </Text>
        </TouchableOpacity>
      )}

      {/* Logout */}
      <TouchableOpacity onPress={handleSignOut} style={styles.logoutBtn}>
        <Text style={[styles.logoutText, { color: tokens.subtle }]}>
          {t("unlock.switch_account")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingHorizontal: 32 },
  header: { alignItems: "center", marginBottom: 36 },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoIcon: { fontSize: 28 },
  greeting: { fontSize: 13, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: "500" },
  dotsWrap: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 36,
  },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5 },
  shake: { transform: [{ translateX: 10 }] },
  numpad: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  numBtn: {
    width: "29%",
    aspectRatio: 1.5,
    borderRadius: 14,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  numBtnEmpty: { backgroundColor: "transparent", borderWidth: 0 },
  numText: { fontSize: 22, fontWeight: "400" },
  biometricBtn: { alignItems: "center", gap: 6, marginBottom: 16 },
  biometricIcon: { fontSize: 28 },
  biometricText: { fontSize: 13 },
  logoutBtn: { alignItems: "center", marginTop: "auto" },
  logoutText: { fontSize: 12 },
});
