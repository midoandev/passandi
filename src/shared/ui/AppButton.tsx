import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  View,
} from "react-native";
import { colors } from "@/shared/config/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type Variant = "primary" | "outline" | "ghost";

type AppButtonProps = {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  label,
  icon,
  onPress,
  variant = "primary",
  loading = false,
  style,
}: AppButtonProps) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";
  const iconOnly = icon && !label;
  const iconColor = isPrimary ? "#fff" : colors.brand.blue;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        isPrimary && { backgroundColor: colors.brand.blue },
        isOutline && styles.outline,
        iconOnly && styles.iconOnly,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={iconColor}
            />
          )}
          {label && (
            <Text
              style={[
                styles.label,
                { color: iconColor },
              ]}
            >
              {label}
            </Text>
          )}
        </View>
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
  iconOnly: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  outline: { borderWidth: 0.5, borderColor: "#2A3A52" },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWithLabel: {
    marginRight: 8,
  },
  label: { fontSize: 15, fontWeight: "500" },
});
