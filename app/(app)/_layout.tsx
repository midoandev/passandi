import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
// import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useTranslation } from "react-i18next";

type TabConfig = {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFill: keyof typeof Ionicons.glyphMap;
};

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();

  const TABS: TabConfig[] = [
    {
      name: "vault",
      label: t("vault.title"),
      icon: "shield-outline",
      iconFill: "shield",
    },
    {
      name: "category",
      label: t("category.title"),
      icon: "grid-outline",
      iconFill: "grid",
    },
    {
      name: "settings",
      label: t("settings.title"),
      icon: "settings-outline",
      iconFill: "settings",
    },
  ];
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const handlePress = (name: string, index: number) => {
    const event = navigation.emit({
      type: "tabPress",
      target: state.routes[index]?.key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) {
      navigation.navigate(name);
    }
  };

  return (
    <View style={[styles.barWrap, { paddingBottom: insets.bottom + 16 }]}>
      <View style={[styles.bar, {
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
      }]}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => handlePress(tab.name, index)}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <View style={[
                styles.tabIconWrap,
                isFocused && {
                  backgroundColor: colors.brand.blue + "18",
                  borderRadius: 10,
                },
              ]}>
                <Ionicons
                  name={isFocused ? tab.iconFill : tab.icon}
                  size={22}
                  color={isFocused ? colors.brand.blue : tokens.subtle}
                />
              </View>
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? colors.brand.blue : tokens.subtle },
              ]}>
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
        sceneStyle: { backgroundColor: tokens.bg },
      }}
    >
      <Tabs.Screen name="vault" />
      <Tabs.Screen name="category" />
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
    paddingHorizontal: 20,
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
    paddingVertical: 2,
  },
  tabIconWrap: {
    width: 40,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { fontSize: 10 },
});