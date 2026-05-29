import { Tabs } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";

const TAB_ICONS: Record<string, string> = {
  vault: "🔐",
  category: "🗂️",
  qrsync: "📷",
  settings: "⚙️",
};

const TAB_LABELS: Record<string, string> = {
  vault: "Brankas",
  category: "Kategori",
  qrsync: "QR Sync",
  settings: "Pengaturan",
};

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.barWrap, { paddingBottom: insets.bottom + 12 }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isMid = index === 2;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Tombol + di tengah (FAB)
          if (isMid) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.8}
                style={styles.fab}
              >
                <Text style={styles.fabIcon}>＋</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <Text style={styles.tabIcon}>{TAB_ICONS[route.name]}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? colors.brand.blue : tokens.subtle },
                ]}
              >
                {TAB_LABELS[route.name]}
              </Text>
              {isFocused && (
                <View
                  style={[styles.dot, { backgroundColor: colors.brand.blue }]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function AppLayout() {
  const { tokens } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: tokens.bg },
      }}
    >
      <Tabs.Screen name="vault" />
      <Tabs.Screen name="category" />
      <Tabs.Screen name="qrsync" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 4,
  },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 10 },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.brand.blue,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  fabIcon: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 28,
  },
});
