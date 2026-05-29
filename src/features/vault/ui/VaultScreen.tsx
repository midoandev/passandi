import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useTranslation } from "react-i18next";

const CATEGORIES = ["Semua", "Favorit", "Bank", "Sosmed", "EWallet", "Work"];

const MOCK_ACCOUNTS = [
  {
    id: "1",
    title: "BCA Mobile",
    sub: "082xxxxxxxx",
    icon: "🏦",
    favorite: true,
    color: "#2563EB22",
    iconColor: "#60A5FA",
  },
  {
    id: "2",
    title: "WhatsApp",
    sub: "agus@gmail.com",
    icon: "💬",
    favorite: true,
    color: "#10B98122",
    iconColor: "#34D399",
  },
  {
    id: "3",
    title: "GoPay",
    sub: "082xxxxxxxx",
    icon: "💳",
    favorite: false,
    color: "#8B5CF622",
    iconColor: "#A78BFA",
  },
  {
    id: "4",
    title: "Instagram",
    sub: "@agus.mido",
    icon: "📸",
    favorite: false,
    color: "#EC489922",
    iconColor: "#F472B6",
  },
  {
    id: "5",
    title: "Tokopedia",
    sub: "agus@gmail.com",
    icon: "🛍️",
    favorite: false,
    color: "#F59E0B22",
    iconColor: "#FCD34D",
  },
];

export function VaultScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greetSub, { color: tokens.muted }]}>
              {t("vault.greeting")}
            </Text>
            <Text style={[styles.greetName, { color: tokens.text }]}>
              Agus 👋
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.avatar,
              {
                backgroundColor: tokens.surface,
                borderColor: tokens.border,
              },
            ]}
          >
            <Text style={styles.avatarText}>AG</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={[
            styles.searchBar,
            {
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            },
          ]}
          activeOpacity={0.7}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={[styles.searchPlaceholder, { color: tokens.subtle }]}>
            {t("vault.search")}
          </Text>
        </TouchableOpacity>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
        >
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catChip,
                i === 0
                  ? { backgroundColor: colors.brand.blue }
                  : {
                      backgroundColor: tokens.surface,
                      borderWidth: 0.5,
                      borderColor: tokens.border,
                    },
              ]}
            >
              <Text
                style={[
                  styles.catText,
                  { color: i === 0 ? "#fff" : tokens.muted },
                ]}
              >
                {t(`category.${cat.toLowerCase()}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section — Favorit */}
        <Text style={[styles.sectionTitle, { color: tokens.muted }]}>
          {t("vault.favorites").toLocaleLowerCase()}
        </Text>

        <View style={styles.accountList}>
          {MOCK_ACCOUNTS.map((acc) => (
            <TouchableOpacity
              key={acc.id}
              activeOpacity={0.7}
              style={[
                styles.accountItem,
                {
                  backgroundColor: tokens.surface,
                  borderColor: tokens.border,
                },
              ]}
            >
              {/* Icon */}
              <View
                style={[styles.accountIcon, { backgroundColor: acc.color }]}
              >
                <Text style={{ fontSize: 18 }}>{acc.icon}</Text>
              </View>

              {/* Body */}
              <View style={styles.accountBody}>
                <Text style={[styles.accountTitle, { color: tokens.text }]}>
                  {acc.title}
                </Text>
                <Text style={[styles.accountSub, { color: tokens.subtle }]}>
                  {acc.sub}
                </Text>
              </View>

              {/* Star */}
              <TouchableOpacity
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Text style={{ fontSize: 16 }}>
                  {acc.favorite ? "⭐" : "☆"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  greetSub: { fontSize: 12, marginBottom: 2 },
  greetName: { fontSize: 22, fontWeight: "500" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 13, fontWeight: "500", color: "#7A9CC4" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchPlaceholder: { fontSize: 13 },

  catList: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  catText: { fontSize: 12 },

  sectionTitle: {
    fontSize: 11,
    letterSpacing: 1.5,
    marginHorizontal: 20,
    marginBottom: 12,
  },

  accountList: { paddingHorizontal: 20, gap: 10 },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    gap: 12,
  },
  accountIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  accountBody: { flex: 1 },
  accountTitle: { fontSize: 14, fontWeight: "500", marginBottom: 3 },
  accountSub: { fontSize: 12 },
});
