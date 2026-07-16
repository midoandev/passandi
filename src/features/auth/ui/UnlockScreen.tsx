import { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { useTheme } from "@/shared/config/ThemeContext";
import { PinPad } from "@/shared/ui";
import { useSecurityStore } from "@/features/auth/model/securityStore";
import { useAuthStore } from "@/features/auth/model/authStore";
import { usePremiumStore } from "@/features/premium/model/premiumStore";

export function UnlockScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const isPremium = usePremiumStore((s) => s.isPremium());

  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const verifyPin = useSecurityStore((s) => s.verifyPin);

  const firstName = user?.user_metadata?.full_name?.split(" ")[0]
    ?? user?.email?.split("@")[0]
    ?? "";

  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then((has) => {
      if (has) LocalAuthentication.isEnrolledAsync().then(setBiometricAvailable);
    });
  }, []);

  useEffect(() => {
    if (pin.length === 6) handleVerify();
  }, [pin]);

  const handleVerify = async () => {
    if (!user?.id) return;
    const valid = await verifyPin(user.id, pin);
    if (valid) {
      router.replace("/(app)/vault");
    } else {
      setIsError(true);
    }
  };

  const handleBiometric = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t("unlock.biometric_prompt"),
      fallbackLabel: t("unlock.use_pin"),
      cancelLabel: t("common.cancel"),
    });
    if (result.success) router.replace("/(app)/vault");
  };

  const handleSignOut = () => {
    Alert.alert(t("common.logout"), t("common.logout_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.logout"), style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <View style={{ flex: 1, paddingVertical: 24 }}>
      <PinPad
        icon="shield-outline" iconType="ionicon"
        title={t("unlock.title")}
        subtitle={t("unlock.greeting", { name: firstName })}
        pin={pin}
        onPinChange={setPin}
        isError={isError}
        onErrorEnd={() => {
          setIsError(false);
          setPin("");
        }}
        showBiometric={biometricAvailable && isPremium}
        onBiometric={handleBiometric}
        footerText={t("unlock.switch_account")}
        onFooterPress={handleSignOut}
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});