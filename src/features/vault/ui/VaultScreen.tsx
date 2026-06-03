import { useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useAuthStore } from "@/features/auth/model/authStore";
import {
  useVaultItems,
  useCategories,
  useToggleFavorite,
} from "@/features/vault/model/useVaultQuery";
import { useVaultUIStore } from "@/features/vault/model/vaultStore";
import { VaultItemCard } from "./VaultItemCard";
import { SkeletonList } from "@/shared/ui/SkeletonItem";
import type { VaultItem } from "@/entities/vault";
import { router } from "expo-router";

// Lazy loading config
const PAGE_SIZE = 15;

export function VaultScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  const selectedCategoryId = useVaultUIStore((s) => s.selectedCategoryId);
  const searchQuery = useVaultUIStore((s) => s.searchQuery);
  const isSearchVisible = useVaultUIStore((s) => s.isSearchVisible);
  const setCategory = useVaultUIStore((s) => s.setCategory);
  const setSearchQuery = useVaultUIStore((s) => s.setSearchQuery);
  const toggleSearch = useVaultUIStore((s) => s.toggleSearch);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: items = [],
    isLoading,
    refetch,
    isRefetching,
  } = useVaultItems();
  const { data: categories = [] } = useCategories();
  const toggleFavorite = useToggleFavorite();

  // Filter items
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (selectedCategoryId === "favorite") {
      result = result.filter((i) => i.isFavorite);
    } else if (selectedCategoryId !== "all") {
      result = result.filter((i) => i.categoryId === selectedCategoryId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.username?.toLowerCase().includes(q) ||
          i.email?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [items, selectedCategoryId, searchQuery]);

  // Lazy loading — slice data per page
  const visibleItems = useMemo(
    () => filteredItems.slice(0, page * PAGE_SIZE),
    [filteredItems, page],
  );

  const hasMore = visibleItems.length < filteredItems.length;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setPage((p) => p + 1);
        setIsLoadingMore(false);
      }, 300);
    }
  }, [hasMore, isLoadingMore]);

  const handleFavorite = useCallback((item: VaultItem) => {
    toggleFavorite.mutate({ id: item.id, current: item.isFavorite });
  }, []);

  const handleItemPress = useCallback((item: VaultItem) => {
    router.push({
      pathname: "/vault-form",
      params: { id: item.id },
    });
  }, []);

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "";

  const renderItem = useCallback(
    ({ item }: { item: VaultItem }) => (
      <VaultItemCard
        item={item}
        onPress={handleItemPress}
        onFavorite={handleFavorite}
      />
    ),
    [handleItemPress, handleFavorite],
  );

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <SkeletonList count={2} />
      </View>
    );
  }, [hasMore]);

  const renderEmpty = () => {
    if (isLoading) return <SkeletonList count={6} />;
    return (
      <View style={styles.emptyWrap}>
        <Ionicons name="shield-outline" size={48} color={tokens.border} />
        <Text style={[styles.emptyTitle, { color: tokens.text }]}>
          {t("vault.empty_title")}
        </Text>
        <Text style={[styles.emptySub, { color: tokens.subtle }]}>
          {t("vault.empty_sub")}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.brand.blue}
          />
        }
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 140,
          paddingHorizontal: 20,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={[styles.greetSub, { color: tokens.muted }]}>
                  {t("vault.greeting")}
                </Text>
                <Text style={[styles.greetName, { color: tokens.text }]}>
                  {firstName} 👋
                </Text>
              </View>
              <TouchableOpacity
                onPress={toggleSearch}
                style={[
                  styles.iconBtn,
                  {
                    backgroundColor: tokens.surface,
                    borderColor: tokens.border,
                  },
                ]}
              >
                <Ionicons
                  name={isSearchVisible ? "close" : "search"}
                  size={20}
                  color={tokens.muted}
                />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            {isSearchVisible && (
              <View
                style={[
                  styles.searchBar,
                  {
                    backgroundColor: tokens.surface,
                    borderColor: tokens.border,
                  },
                ]}
              >
                <Ionicons name="search" size={16} color={tokens.subtle} />
                <TextInput
                  style={[styles.searchInput, { color: tokens.text }]}
                  placeholder={t("vault.search")}
                  placeholderTextColor={tokens.subtle}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={tokens.subtle}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Category Chips */}
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(c) => c.id}
              contentContainerStyle={styles.catList}
              renderItem={({ item: cat }) => {
                const isActive = selectedCategoryId === cat.id;
                return (
                  <TouchableOpacity
                    onPress={() => setCategory(cat.id)}
                    style={[
                      styles.catChip,
                      isActive
                        ? { backgroundColor: colors.brand.blue }
                        : {
                            backgroundColor: tokens.surface,
                            borderWidth: 0.5,
                            borderColor: tokens.border,
                          },
                    ]}
                  >
                    <Text style={styles.catIcon}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.catLabel,
                        { color: isActive ? "#fff" : tokens.muted },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            {/* Section Title */}
            {filteredItems.length > 0 && (
              <Text style={[styles.sectionTitle, { color: tokens.muted }]}>
                {filteredItems.length} {t("vault.items_count")}
              </Text>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  greetSub: { fontSize: 12, marginBottom: 2 },
  greetName: { fontSize: 22, fontWeight: "500" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14 },

  catList: { gap: 8, marginBottom: 16, paddingRight: 4 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
  },
  catIcon: { fontSize: 13 },
  catLabel: { fontSize: 12 },

  sectionTitle: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: "500" },
  emptySub: { fontSize: 13, textAlign: "center" },

  footerLoader: { paddingTop: 4 },
});
