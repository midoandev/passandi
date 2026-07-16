import { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { PinPad } from "@/shared/ui";
import { useSecurityStore } from "@/features/auth/model/securityStore";
import { useAuthStore } from "@/features/auth/model/authStore";

type Step = "verify" | "new" | "confirm";

export function ChangePinScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>("verify");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [isError, setIsError] = useState(false);
  const oldPin = useRef("");

  const user = useAuthStore((s) => s.user);
  const verifyPin = useSecurityStore((s) => s.verifyPin);
  const changePin = useSecurityStore((s) => s.changePin);

  useEffect(() => {
    if (pin.length !== 6) return;

    const handle = async () => {
      if (!user?.id) return;

      if (step === "verify") {
        const valid = await verifyPin(user.id, pin);
        if (valid) {
          oldPin.current = pin;
          setPin("");
          setStep("new");
        } else {
          setIsError(true);
        }
        return;
      }

      if (step === "new") {
        setNewPin(pin);
        setPin("");
        setTimeout(() => setStep("confirm"), 200);
        return;
      }

      if (step === "confirm") {
        if (pin !== newPin) {
          setIsError(true);
        } else {
          await changePin(user.id, oldPin.current, newPin);
          Alert.alert(t("common.success"), t("change_pin.success"), [
            { text: t("common.ok"), onPress: () => router.back() },
          ]);
        }
      }
    };

    handle();
  }, [pin]);

  const stepConfig: Record<Step, { title: string; subtitle: string; step: number }> = {
    verify: {
      title: t("change_pin.step_current"),
      subtitle: t("change_pin.step_current_sub"),
      step: 1,
    },
    new: {
      title: t("change_pin.step_new"),
      subtitle: t("change_pin.step_new_sub"),
      step: 2,
    },
    confirm: {
      title: t("change_pin.step_confirm"),
      subtitle: t("change_pin.step_confirm_sub"),
      step: 3,
    },
  };

  const config = stepConfig[step];

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar
        title={t("settings.change_pin")}
        onBack={() => {
          if (step === "verify") {
            router.back();
          } else if (step === "new") {
            setStep("verify");
            setPin("");
          } else {
            setStep("new");
            setPin("");
            setNewPin("");
          }
        }}
      />
      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <PinPad
          icon="keypad"
          iconType="ionicon"
          title={config.title}
          subtitle={config.subtitle}
          pin={pin}
          onPinChange={setPin}
          isError={isError}
          onErrorEnd={() => {
            setIsError(false);
            setPin("");
            if (step === "confirm") {
              setStep("new");
              setNewPin("");
            }
          }}
          steps={3}
          currentStep={config.step}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1 },
});