import { useState } from "react";
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useTranslation } from "react-i18next";

type Props = {
  label: string;
  value: string;
  isSecret?: boolean;
  copyLabel?: string;
  onCopy?: () => void;
};

export function DetailField({
  label, value, isSecret = false, copyLabel,
}: Props) {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const [revealed, setRevealed] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  if (!value) return null;

  const displayValue = isSecret && !revealed
    ? "•".repeat(Math.min(value.length, 12))
    : value;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(value);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 2000);
  };

  return (
    <View style={[styles.wrap, {
      backgroundColor: tokens.surface,
      borderColor: tokens.border,
    }]}>
      {/* Label */}
      <Text style={[styles.label, { color: tokens.muted }]}>
        {label}
      </Text>

      {/* Value Row */}
      <View style={styles.valueRow}>
        <Text
          style={[styles.value, { color: tokens.text }]}
          numberOfLines={isSecret && !revealed ? 1 : undefined}
          selectable={!isSecret || revealed}
        >
          {displayValue}
        </Text>

        <View style={styles.actions}>
          {/* Reveal toggle */}
          {isSecret && (
            <TouchableOpacity
              onPress={() => setRevealed((r) => !r)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[styles.actionBtn, { backgroundColor: tokens.bg }]}
            >
              <Ionicons
                name={revealed ? "eye-off-outline" : "eye-outline"}
                size={16}
                color={tokens.muted}
              />
            </TouchableOpacity>
          )}

          {/* Copy button */}
          <TouchableOpacity
            onPress={handleCopy}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[styles.actionBtn, {
              backgroundColor: justCopied
                ? colors.brand.blue + "22"
                : tokens.bg,
            }]}
          >
            <Ionicons
              name={justCopied ? "checkmark" : "copy-outline"}
              size={16}
              color={justCopied ? colors.brand.blue : tokens.muted}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  value: { fontSize: 15, flex: 1 },
  actions: { flexDirection: "row", gap: 6 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});