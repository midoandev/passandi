import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { useTheme } from "@/shared/config/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

type AppInputProps = TextInputProps & {
  label: string;
  isPassword?: boolean;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  iconSize?: React.ComponentProps<typeof Ionicons>["size"];
};

export function AppInput({
  label,
  isPassword = false,
  iconName,
  iconSize,
  ...props
}: AppInputProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const [show, setShow] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: tokens.muted }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
          },
        ]}
      >
        <View style={styles.iconRow}>
          {iconName && (
            <Ionicons
              name={iconName}
              size={iconSize ?? 18}
              color={tokens.subtle}
            />
          )}
          <TextInput
            style={[
              styles.input,
              { color: tokens.text, paddingLeft: iconName ? 8 : 0 },
            ]}
            placeholderTextColor={tokens.subtle}
            secureTextEntry={isPassword && !show}
            {...props}
          />
        </View>
        {isPassword && (
          <TouchableOpacity onPress={() => setShow((s) => !s)}>
            <Text style={[styles.toggle, { color: tokens.subtle }]}>
              {show ? t("common.hide") : t("common.show")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontSize: 11, marginBottom: 6, letterSpacing: 0.5 },
  inputRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 0.5,
  },
  input: { flex: 1, fontSize: 14 },
  toggle: { fontSize: 12 },
  iconRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 1,
  },
});
