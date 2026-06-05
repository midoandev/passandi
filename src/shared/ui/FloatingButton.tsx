import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/shared/config/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/shared/config/ThemeContext";

type FloatingButtonProps = {
  onPress?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
};

export function FloatingButton({
  onPress,
}: FloatingButtonProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.fabWrap}>
      <View style={[styles.fabRing, { borderColor: tokens.bg }]} />
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fabWrap: {
    width: 72,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 24, bottom: 150,
    zIndex: 10,
  },
  fabRing: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 6,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.brand.blue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.brand.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
