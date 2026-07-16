import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/shared/config/ThemeContext";

type AppBarProps = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
};

export function AppBar({
  title,
  showBack = true,
  onBack,
  right,
  transparent = false,
}: AppBarProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 8,
          backgroundColor: transparent ? "transparent" : tokens.bg,
          borderBottomColor: transparent ? "transparent" : tokens.border,
        },
      ]}
    >
      {/* Kiri — Back Button */}
      <View style={styles.side}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[
              styles.backBtn,
              {
                backgroundColor: tokens.surface,
                borderColor: tokens.border,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={18} color={tokens.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tengah — Title */}
      <Text numberOfLines={1} style={[styles.title, { color: tokens.text }]}>
        {title ?? ""}
      </Text>

      {/* Kanan — Custom Action */}
      <View style={[styles.side, styles.sideRight]}>{right ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  side: { width: 44 },
  sideRight: { alignItems: "flex-end" },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { fontSize: 18, lineHeight: 22 },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});
