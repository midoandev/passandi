import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/shared/config/ThemeContext";

export default function CategoryScreen() {
  const { tokens } = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: tokens.bg }]}>
      <Text style={{ color: tokens.text }}>Kategori</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
