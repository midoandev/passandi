import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors } from "@/shared/config/ThemeContext";

type Variant = "primary" | "outline" | "ghost";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  loading = false,
  style,
}: AppButtonProps) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        isPrimary && { backgroundColor: colors.brand.blue },
        isOutline && styles.outline,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : colors.brand.blue} />
      ) : (
        <Text
          style={[
            styles.label,
            { color: isPrimary ? "#fff" : colors.brand.blue },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  outline: { borderWidth: 0.5, borderColor: "#2A3A52" },
  label: { fontSize: 15, fontWeight: "500" },
});
