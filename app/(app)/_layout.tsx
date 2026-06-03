import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { router } from "expo-router";

type TabConfig = {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFill: keyof typeof Ionicons.glyphMap;
};

const TABS: TabConfig[] = [
  {
    name: "vault",
    label: "Brankas",
    icon: "shield-outline",
    iconFill: "shield",
  },
  {
    name: "category",
    label: "Kategori",
    icon: "grid-outline",
    iconFill: "grid",
  },
  {
    name: "qrsync",
    label: "QR Sync",
    icon: "qr-code-outline",
    iconFill: "qr-code",
  },
  {
    name: "settings",
    label: "Pengaturan",
    icon: "settings-outline",
    iconFill: "settings",
  },
];

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  // Index FAB ada di tengah antara tab 1 dan 2
  const leftTabs = TABS.slice(0, 2);
  const rightTabs = TABS.slice(2, 4);

  const getTabIndex = (name: string) => TABS.findIndex((t) => t.name === name);

  const handlePress = (name: string) => {
    const index = getTabIndex(name);
    const event = navigation.emit({
      type: "tabPress",
      target: state.routes[index]?.key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) {
      navigation.navigate(name);
    }
  };
  const handleFAB = () => {
    router.push({
      pathname: "/vault-form",
    });
  };

  return (
    <View style={[styles.barWrap, { paddingBottom: insets.bottom + 8 }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
          },
        ]}
      >
        {/* Left Tabs */}
        {leftTabs.map((tab) => {
          const isFocused = state.routes[getTabIndex(tab.name)]
            ? state.index === getTabIndex(tab.name)
            : false;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => handlePress(tab.name)}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <View
                style={[
                  styles.tabIconWrap,
                  isFocused && {
                    backgroundColor: colors.brand.blue + "18",
                    borderRadius: 10,
                  },
                ]}
              >
                <Ionicons
                  name={isFocused ? tab.iconFill : tab.icon}
                  size={22}
                  color={isFocused ? colors.brand.blue : tokens.subtle}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? colors.brand.blue : tokens.subtle },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* FAB Center */}
        <View style={styles.fabWrap}>
          <View style={[styles.fabRing, { borderColor: tokens.bg }]} />
          <TouchableOpacity
            onPress={handleFAB}
            activeOpacity={0.8}
            style={styles.fab}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Right Tabs */}
        {rightTabs.map((tab) => {
          const isFocused = state.routes[getTabIndex(tab.name)]
            ? state.index === getTabIndex(tab.name)
            : false;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => handlePress(tab.name)}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <View
                style={[
                  styles.tabIconWrap,
                  isFocused && {
                    backgroundColor: colors.brand.blue + "18",
                    borderRadius: 10,
                  },
                ]}
              >
                <Ionicons
                  name={isFocused ? tab.iconFill : tab.icon}
                  size={22}
                  color={isFocused ? colors.brand.blue : tokens.subtle}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? colors.brand.blue : tokens.subtle },
                ]}
              >
                {tab.label}
              </Text>
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
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 2,
  },
  tabIconWrap: {
    width: 40,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { fontSize: 10 },
  fabWrap: {
    width: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  fabRing: {
    position: "absolute",
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
