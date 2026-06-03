import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useTheme } from "@/shared/config/ThemeContext";

export function SkeletonItem() {
  const { tokens } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          opacity,
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: tokens.border }]} />
      <View style={styles.body}>
        <View
          style={[
            styles.line,
            { backgroundColor: tokens.border, width: "60%" },
          ]}
        />
        <View
          style={[
            styles.line,
            { backgroundColor: tokens.border, width: "40%" },
          ]}
        />
      </View>
    </Animated.View>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </>
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
  icon: { width: 42, height: 42, borderRadius: 12 },
  body: { flex: 1, gap: 8 },
  line: { height: 8, borderRadius: 4 },
});
