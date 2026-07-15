import { useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { IoniconsName } from "@/shared/lib/iconTypes";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useTranslation } from "react-i18next";

const PIN_LENGTH = 6;
const NUMPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

type PinPadProps = {
  icon?: string;
  iconType?: "emoji" | "ionicon";
  title: string;
  /** @deprecated Only emoji-type icons are supported. Ionicon type will be removed in favor of emoji. */
  subtitle?: string;
  pin: string;
  onPinChange: (pin: string) => void;
  isError?: boolean;
  onErrorEnd?: () => void;

  // Step indicator opsional
  steps?: number;    // total steps
  currentStep?: number;   // step aktif

  // Biometrik opsional
  showBiometric?: boolean;
  onBiometric?: () => void;

  // Footer opsional
  footerText?: string;
  onFooterPress?: () => void;
};

export function PinPad({
  icon = "shield",
  iconType = "emoji",
  title,
  subtitle,
  pin,
  onPinChange,
  isError = false,
  onErrorEnd,
  steps,
  currentStep,
  showBiometric = true,
  onBiometric,
  footerText,
  onFooterPress,
}: PinPadProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Shake animation saat error
  useEffect(() => {
    if (!isError) return;

    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start(() => onErrorEnd?.());
  }, [isError]);

  const handlePress = (val: string) => {
    if (val === "⌫") {
      onPinChange(pin.slice(0, -1));
      return;
    }
    if (val === "" || pin.length >= PIN_LENGTH) return;
    onPinChange(pin + val);
  };

  return (
    <View style={styles.wrap}>

      {/* Step Indicator */}
      {steps && currentStep !== undefined && (
        <View style={styles.stepsWrap}>
          {Array.from({ length: steps }).map((_, i) => (
            <View
              key={i}
              style={[styles.stepDot, {
                backgroundColor: i < currentStep
                  ? colors.brand.blue
                  : tokens.border,
                width: i < currentStep ? 20 : 8,
              }]}
            />
          ))}
        </View>
      )}

      {/* Icon */}
      <View style={[styles.iconWrap, {
        backgroundColor: colors.brand.navy,
        borderColor: colors.brand.blue + "44",
      }]}>
        {iconType === "emoji" ? (
          <Text style={styles.iconEmoji}>{icon}</Text>
        ) : icon ? (
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={28} color={colors.brand.blue} />
        ) : null}
      </View>

      {/* Title & Subtitle */}
      <Text style={[styles.title, { color: tokens.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: tokens.muted }]}>{subtitle}</Text>
      )}

      {/* PIN Dots */}
      <Animated.View style={[
        styles.dotsRow,
        { transform: [{ translateX: shakeAnim }] },
      ]}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, {
              backgroundColor: i < pin.length
                ? isError ? colors.brand.danger : colors.brand.blue
                : "transparent",
              borderColor: i < pin.length
                ? isError ? colors.brand.danger : colors.brand.blue
                : tokens.border,
            }]}
          />
        ))}
      </Animated.View>

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
                  borderWidth: 1,
                },
                isEmpty && styles.numBtnEmpty,
              ]}
            >
              {isDel ? (
                <Ionicons name="backspace-outline" size={22} color={tokens.muted} />
              ) : (
                <Text style={[
                  styles.numText,
                  { color: isNum ? tokens.text : "transparent" },
                ]}>
                  {val}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Biometrik */}
      {showBiometric && onBiometric && (
        <TouchableOpacity
          onPress={onBiometric}
          style={styles.biometricBtn}
          hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
        >
          <Ionicons name="finger-print" size={24} color={tokens.muted} />
          <Text style={[styles.biometricText, { color: tokens.muted }]}>
            {t("unlock.use_biometric")}
          </Text>
        </TouchableOpacity>
      )}

      {/* Footer link */}
      {footerText && onFooterPress && (
        <TouchableOpacity
          onPress={onFooterPress}
          hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
          style={styles.footerBtn}
        >
          <Text style={[styles.footerText, { color: tokens.subtle }]}>
            {footerText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 8,
  },

  // Steps
  stepsWrap: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 28,
    alignItems: "center",
  },
  stepDot: { height: 8, borderRadius: 4 },

  // Icon
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconEmoji: { fontSize: 32 },

  // Text
  title: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 36,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },

  // Numpad
  numpad: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: 'center',
    gap: 15,
    width: "100%",
  },
  numBtn: {
    width: "29%",
    aspectRatio: 1.9,
    borderRadius: 12,
    borderWidth: .2,
    alignItems: "center",
    justifyContent: "center",
  },
  numBtnEmpty: { backgroundColor: "transparent", borderWidth: 0 },
  numText: { fontSize: 21, fontWeight: "400" },

  // Biometric
  biometricBtn: {
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  biometricText: { fontSize: 13 },

  // Footer
  footerBtn: { marginTop: "auto", paddingVertical: 8 },
  footerText: { fontSize: 12 },
});