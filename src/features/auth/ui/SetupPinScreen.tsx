import { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";
import { PinPad } from "@/shared/ui";
import { useSecurityStore } from "@/features/auth/model/securityStore";
import { useAuthStore } from "@/features/auth/model/authStore";

type Step = "create" | "confirm";

export function SetupPinScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();

  const [step, setStep] = useState<Step>("create");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [isError, setIsError] = useState(false);

  const user = useAuthStore((s) => s.user);
  const setupPin = useSecurityStore((s) => s.setupPin);

  useEffect(() => {
    if (step === "create" && pin.length === 6) {
      setNewPin(pin);
      setPin("");
      setTimeout(() => setStep("confirm"), 200);
    }

    if (step === "confirm" && pin.length === 6) {
      if (pin !== newPin) {
        setIsError(true);
      } else {
        handleSave();
      }
    }
  }, [pin]);

  const handleSave = async () => {
    if (!user?.id) return;
    await setupPin(user.id, newPin);
    router.replace("/(auth)/setup-success");
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <View style={{ flex: 1, paddingVertical: 24 }}>
      <PinPad
        icon="🔢"
        title={step === "create"
          ? t("security.pin_title")
          : t("security.pin_confirm_title")}
        subtitle={step === "create"
          ? t("security.pin_subtitle")
          : t("security.pin_confirm_subtitle")}
        pin={pin}
        onPinChange={setPin}
        isError={isError}
        onErrorEnd={() => {
          setIsError(false);
          setPin("");
          setStep("create");
          setNewPin("");
        }}
        steps={2}
        currentStep={step === "create" ? 1 : 2}
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});