import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSyncStore } from "@/shared/lib/sync/syncStore";
import { colors } from "@/shared/config/ThemeContext";
import { useTheme } from "@/shared/config/ThemeContext";
import { useTranslation } from "react-i18next";

export function SyncIndicator() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const status = useSyncStore((s) => s.status);
  const pendingCount = useSyncStore((s) => s.pendingCount);
  const isOnline = useSyncStore((s) => s.isOnline);
  const rotation = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (status === "syncing") {
      spinAnimation.current = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinAnimation.current.start();
    } else {
      spinAnimation.current?.stop();
      rotation.setValue(0);
    }
  }, [status]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (status === "idle" && isOnline && pendingCount === 0) return null;

  const getConfig = () => {
    if (!isOnline) return { icon: "cloud-offline-outline", color: tokens.subtle, text: t("sync.offline") };
    if (status === "syncing") return { icon: "sync-outline", color: colors.brand.blue, text: t("sync.syncing") };
    if (status === "success") return { icon: "checkmark-circle", color: "#10B981", text: t("sync.synced") };
    if (status === "error") return { icon: "alert-circle-outline", color: colors.brand.danger, text: t("sync.error") };
    if (pendingCount > 0) return { icon: "time-outline", color: colors.brand.gold, text: `${pendingCount} ${t("sync.pending")}` };
    return null;
  };

  const config = getConfig();
  if (!config) return null;

  return (
    <View style={[styles.wrap, {
      backgroundColor: tokens.surface,
      borderColor: config.color + "44",
    }]}>
      <Animated.View style={status === "syncing" ? { transform: [{ rotate: spin }] } : undefined}>
        <Ionicons name={config.icon as any} size={12} color={config.color} />
      </Animated.View>
      <Text style={[styles.text, { color: config.color }]}>
        {config.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  text: { fontSize: 11 },
});