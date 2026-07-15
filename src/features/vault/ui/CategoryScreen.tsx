import { useState, useCallback, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { SkeletonList } from "@/shared/ui/SkeletonItem";
import { CategoryFormSheet } from "./CategoryFormSheet";
import { DraggableCategoryRow } from "./DraggableCategoryRow";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
  useVaultItems,
} from "../model/useVaultQuery";
import type { VaultCategory } from "@/entities/vault";
import {
  isAllCategory, isFavoriteCategory, isSystemCategory,
} from "@/shared/config/categoryHelpers";
import { useSubscriptionTier } from "@/features/premium/model/premiumStore";
import { canCreateCategory } from "@/shared/lib/premium/premiumUtils";
import { UpgradePrompt } from "@/shared/ui";

export function CategoryScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const tier = useSubscriptionTier();
  const canAddCustom = canCreateCategory(tier, 0);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editItem, setEditItem] = useState<VaultCategory | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [localCustom, setLocalCustom] = useState<VaultCategory[]>([]);

  const { data: categories = [], isLoading } = useCategories();
  const { data: vaultItems = [] } = useVaultItems();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const reorderCategories = useReorderCategories();

  const defaultCategories = categories.filter((c) => c.isDefault);
  const customCategories = categories.filter(
    (c) => !c.isDefault && c.id !== "all" && c.id !== "favorite"
  );
  // Sync local state saat data dari server berubah
  useEffect(() => {
    setLocalCustom(customCategories);
  }, [categories]);

  // getItemCount — pakai label
  const getItemCount = useCallback((cat: VaultCategory) => {
    if (isAllCategory(cat)) return vaultItems.length;
    if (isFavoriteCategory(cat)) return vaultItems.filter((i) => i.isFavorite).length;
    return vaultItems.filter((i) => i.categoryId === cat.id).length;
  }, [vaultItems]);

  const handleDragStart = useCallback((id: string) => {
    setDraggingId(id);
  }, []);

  const handleDragEnd = useCallback((id: string, newIndex: number) => {
    setDraggingId(null);

    const current = [...localCustom];
    const fromIndex = current.findIndex((i) => i.id === id);
    if (fromIndex === -1 || fromIndex === newIndex) return;

    // Update local state dulu (optimistic)
    const moved = current.splice(fromIndex, 1)[0];
    current.splice(newIndex, 0, moved);
    setLocalCustom(current);

    // Persist ke DB
    reorderCategories.mutate(
      current.map((item, idx) => ({
        id: item.id,
        sortOrder: defaultCategories.length + idx,
      }))
    );
  }, [localCustom, defaultCategories.length]);

  const handleAdd = () => {
    setEditItem(null);
    setSheetVisible(true);
  };

  const handleEdit = useCallback((item: VaultCategory) => {
    setEditItem(item);
    setSheetVisible(true);
  }, []);

  const handleDelete = useCallback((item: VaultCategory) => {
    Alert.alert(
      t("category.delete_title"),
      t("category.delete_confirm", { name: item.label }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteCategory.mutate(item.id),
        },
      ]
    );
  }, []);

  const handleSave = async (label: string, icon: string, color: string) => {
    if (editItem) {
      await updateCategory.mutateAsync({ id: editItem.id, label, icon });
    } else {
      await createCategory.mutateAsync({ label, icon, color });
    }
    setSheetVisible(false);
    setEditItem(null);
  };

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, {
          paddingBottom: insets.bottom + 120,
          paddingTop: 16,
        }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.pageTitle, { color: tokens.text }]}>
          {t("category.title")}
        </Text>

        {isLoading ? (
          <SkeletonList count={6} />
        ) : (
          <>
            {/* Default Categories */}
            <Text style={[styles.sectionLabel, { color: tokens.muted }]}>
              {t("category.section_default")}
            </Text>
            <View style={styles.group}>
              {defaultCategories.map((cat, index) => (
                <DraggableCategoryRow
                  key={cat.id}
                  item={cat}
                  index={index}
                  totalCount={defaultCategories.length}
                  itemCount={getItemCount(cat)}
                  isDragging={draggingId === cat.id}
                  // isSystem={isSystemCategory(cat)
                  isSystem
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </View>

            {/* Custom Categories */}
            <Text style={[styles.sectionLabel, {
              color: tokens.muted,
              marginTop: 24,
            }]}>
              {t("category.section_custom")}
            </Text>

            {localCustom.length > 0 ? (
              <View style={styles.group}>
                {localCustom.map((cat, index) => (
                  <DraggableCategoryRow
                    key={cat.id}
                    item={cat}
                    index={index}
                    totalCount={localCustom.length}
                    itemCount={getItemCount(cat)}
                    isDragging={draggingId === cat.id}
                    isSystem={isSystemCategory(cat)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </View>
            ) : canAddCustom ? (
              <TouchableOpacity
                onPress={handleAdd}
                style={[styles.emptyBtn, {
                  borderColor: colors.brand.blue + "44",
                  backgroundColor: tokens.surface,
                }]}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={colors.brand.blue}
                />
                <Text style={[styles.emptyText, { color: colors.brand.blue }]}>
                  {t("category.add_first")}
                </Text>
              </TouchableOpacity>
            ) : (
              <UpgradePrompt
                featureName={t('premium.feature_custom_categories')}
                message={t('premium.custom_categories_message')}
                onUpgrade={() => router.push('/(premium)/paywall')}
              />
            )}

            {/* Info Box */}
            <View style={[styles.infoBox, {
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            }]}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.brand.blue}
              />
              <Text style={[styles.infoText, { color: tokens.muted }]}>
                {t("category.info_guide")}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <CategoryFormSheet
        visible={sheetVisible}
        editItem={editItem}
        onClose={() => { setSheetVisible(false); setEditItem(null); }}
        onSave={handleSave}
        loading={createCategory.isPending || updateCategory.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  pageTitle: { fontSize: 26, fontWeight: "600", marginBottom: 20 },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  group: { gap: 8 },
  addText: { fontSize: 14, fontWeight: "500" },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 16,
  },
  emptyText: { fontSize: 14, fontWeight: "500" },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 0.5,
    marginTop: 24,
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20 },
});