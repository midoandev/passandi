import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useSecurityStore } from "@/features/auth/model/securityStore";
import { useAuthStore } from "../model/authStore";

const PIN_LENGTH = 6;
const NUMPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export function SetupPinScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const user = useAuthStore((s) => s.user);
  const setupPin = useSecurityStore((s) => s.setupPin);

  // Auto proceed saat PIN penuh
  useEffect(() => {
    if (!isConfirming && pin.length === PIN_LENGTH) {
      setTimeout(() => setIsConfirming(true), 200);
    }
    if (isConfirming && confirmPin.length === PIN_LENGTH) {
      handleConfirm();
    }
  }, [pin, confirmPin]);

  const handlePress = (val: string) => {
    if (val === "⌫") {
      if (isConfirming) setConfirmPin((p) => p.slice(0, -1));
      else setPin((p) => p.slice(0, -1));
      return;
    }
    if (val === "") return;

    if (!isConfirming && pin.length < PIN_LENGTH) {
      setPin((p) => p + val);
    }
    if (isConfirming && confirmPin.length < PIN_LENGTH) {
      setConfirmPin((p) => p + val);
    }
  };

  const handleConfirm = async () => {
    if (pin !== confirmPin) {
      Alert.alert(t("common.error"), t("security.pin_error_not_match"));
      setConfirmPin("");
      setIsConfirming(false);
      setPin("");
      return;
    }
    if (!user?.id) return;
    await setupPin(user.id, pin);
    router.replace("/(auth)/setup-success");
  };

  const currentPin = isConfirming ? confirmPin : pin;

  return (
    <View
      style={[
        styles.flex,
        { backgroundColor: tokens.bg, paddingTop: insets.top + 16 },
      ]}
    >
      {/* Step Indicator */}
      <Text style={[styles.stepLabel, { color: tokens.muted }]}>
        {t("security.step_of", { current: 2, total: 2 })}
      </Text>

      <View style={styles.stepDots}>
        <View style={[styles.dot, { backgroundColor: colors.brand.blue }]} />
        <View style={[styles.dot, { backgroundColor: colors.brand.blue }]} />
      </View>

      {/* Icon */}
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.brand.navy,
            borderColor: colors.brand.blue + "44",
          },
        ]}
      >
        <Text style={styles.icon}>🔢</Text>
      </View>

      <Text style={[styles.title, { color: tokens.text }]}>
        {isConfirming
          ? t("security.pin_confirm_title")
          : t("security.pin_title")}
      </Text>
      <Text style={[styles.subtitle, { color: tokens.muted }]}>
        {isConfirming
          ? t("security.pin_confirm_subtitle")
          : t("security.pin_subtitle")}
      </Text>

      {/* PIN Dots */}
      <View style={styles.pinDots}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.pinDot,
              {
                backgroundColor:
                  i < currentPin.length ? colors.brand.blue : "transparent",
                borderColor:
                  i < currentPin.length ? colors.brand.blue : tokens.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Numpad */}
      <View style={styles.numpad}>
        {NUMPAD.map((val, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handlePress(val)}
            activeOpacity={val === "" ? 1 : 0.6}
            style={[
              styles.numBtn,
              val === "" && styles.numBtnEmpty,
              val !== "" &&
                val !== "⌫" && {
                  backgroundColor: tokens.surface,
                  borderColor: tokens.border,
                },
            ]}
          >
            <Text
              style={[
                styles.numText,
                val === "⌫" && { color: tokens.muted, fontSize: 20 },
                val !== "⌫" && { color: tokens.text },
              ]}
            >
              {val}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, paddingHorizontal: 32 },
  stepLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 12,
  },
  stepDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  icon: { fontSize: 32 },
  title: {
    fontSize: 22,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: { fontSize: 13, textAlign: "center", marginBottom: 32 },
  pinDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 40,
  },
  pinDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5 },
  numpad: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
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
});
