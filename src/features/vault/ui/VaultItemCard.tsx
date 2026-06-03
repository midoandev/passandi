import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import type { VaultItem } from "@/entities/vault";

type Props = {
  item: VaultItem;
  onPress: (item: VaultItem) => void;
  onFavorite: (item: VaultItem) => void;
};

export function VaultItemCard({ item, onPress, onFavorite }: Props) {
  const { tokens } = useTheme();

  const subtitle = item.username ?? item.email ?? item.phone ?? "";

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      style={[
        styles.wrap,
        {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        },
      ]}
    >
      {/* Icon */}
      <View
        style={[styles.iconWrap, { backgroundColor: item.iconColor + "22" }]}
      >
        {item.iconType === "emoji" ? (
          <Text style={styles.emoji}>{item.iconValue}</Text>
        ) : item.iconType === "ionicon" ? (
          <Ionicons
            name={item.iconValue as any}
            size={22}
            color={item.iconColor}
          />
        ) : (
          <View
            style={[styles.colorDot, { backgroundColor: item.iconColor }]}
          />
        )}
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={[styles.title, { color: tokens.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.sub, { color: tokens.subtle }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Favorite */}
      <TouchableOpacity
        onPress={() => onFavorite(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={item.isFavorite ? "star" : "star-outline"}
          size={18}
          color={item.isFavorite ? colors.brand.gold : tokens.border}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    gap: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 20 },
  colorDot: { width: 20, height: 20, borderRadius: 10 },
  body: { flex: 1 },
  title: { fontSize: 14, fontWeight: "500", marginBottom: 2 },
  sub: { fontSize: 12 },
});
