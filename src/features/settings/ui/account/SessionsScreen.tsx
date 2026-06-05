import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";

export function SessionsScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar title="Sesi Aktif" />

      <View style={[styles.content, { paddingBottom: insets.bottom + 40 }]}>

        {/* Coming Soon Card */}
        <View style={[styles.card, {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }]}>
          <View style={[styles.iconWrap, {
            backgroundColor: colors.brand.blue + "22",
          }]}>
            <Ionicons name="laptop-outline" size={32} color={colors.brand.blue} />
          </View>

          <Text style={[styles.title, { color: tokens.text }]}>
            Multi-Device Support
          </Text>
          <Text style={[styles.subtitle, { color: tokens.muted }]}>
            Fitur ini sedang dalam pengembangan.{"\n"}
            Kamu akan bisa melihat semua device yang login, mencabut akses, dan scan QR untuk buka Passandi di browser laptop.
          </Text>

          <View style={[styles.badge, { backgroundColor: colors.brand.blue + "22" }]}>
            <Ionicons name="time-outline" size={13} color={colors.brand.blue} />
            <Text style={[styles.badgeText, { color: colors.brand.blue }]}>
              Coming Soon
            </Text>
          </View>
        </View>

        {/* Info saat ini */}
        <View style={[styles.infoBox, {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }]}>
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={colors.brand.blue}
          />
          <Text style={[styles.infoText, { color: tokens.muted }]}>
            Saat ini Passandi mendukung login di beberapa perangkat mobile sekaligus menggunakan akun yang sama.
          </Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  card: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 22,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },

  infoBox: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 0.5,
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
});