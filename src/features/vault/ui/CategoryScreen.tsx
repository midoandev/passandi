import { useState, useCallback, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
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

export function CategoryScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

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
  const customCategories = categories.filter((c) => !c.isDefault);

  // Sync local state saat data dari server berubah
  useEffect(() => {
    setLocalCustom(customCategories);
  }, [categories]);

  const getItemCount = useCallback((categoryId: string) => {
    if (categoryId === "all") return vaultItems.length;
    if (categoryId === "favorite") return vaultItems.filter((i) => i.isFavorite).length;
    return vaultItems.filter((i) => i.categoryId === categoryId).length;
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
      <AppBar
        title={t("category.title")}
        showBack={false}
        right={
          <TouchableOpacity
            onPress={handleAdd}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.addText, { color: colors.brand.blue }]}>
              + {t("category.add")}
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, {
          paddingBottom: insets.bottom + 120,
        }]}
        showsVerticalScrollIndicator={false}
        // Disable scroll saat drag
        scrollEnabled={!draggingId}
      >
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
                  itemCount={getItemCount(cat.id)}
                  isDragging={draggingId === cat.id}
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
                    itemCount={getItemCount(cat.id)}
                    isDragging={draggingId === cat.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </View>
            ) : (
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