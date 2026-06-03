import { useState, useCallback } from "react";
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
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useVaultItems,
} from "../model/useVaultQuery";
import type { VaultCategory } from "@/entities/vault";

export function CategoryScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editItem, setEditItem] = useState<VaultCategory | null>(null);

  const { data: categories = [], isLoading } = useCategories();
  const { data: vaultItems = [] } = useVaultItems();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Hitung jumlah item per kategori
  const getItemCount = useCallback((categoryId: string) => {
    if (categoryId === "all") return vaultItems.length;
    if (categoryId === "favorite") return vaultItems.filter((i) => i.isFavorite).length;
    return vaultItems.filter((i) => i.categoryId === categoryId).length;
  }, [vaultItems]);

  const defaultCategories = categories.filter((c) => c.isDefault);
  const customCategories = categories.filter((c) => !c.isDefault);

  const handleAdd = () => {
    setEditItem(null);
    setSheetVisible(true);
  };

  const handleEdit = (item: VaultCategory) => {
    setEditItem(item);
    setSheetVisible(true);
  };

  const handleDelete = (item: VaultCategory) => {
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
  };

  const handleSave = async (label: string, icon: string, color: string) => {
    if (editItem) {
      await updateCategory.mutateAsync({ id: editItem.id, label, icon });
    } else {
      await createCategory.mutateAsync({ label, icon, color });
    }
    setSheetVisible(false);
  };

  const renderCategoryRow = (
    item: VaultCategory,
    isDraggable: boolean,
  ) => {
    const count = getItemCount(item.id);

    return (
      <View
        key={item.id}
        style={[styles.row, {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }]}
      >
        {/* Drag Handle */}
        <Ionicons
          name="reorder-three"
          size={22}
          color={isDraggable ? tokens.muted : tokens.border}
          style={isDraggable ? undefined : styles.dragDisabled}
        />

        {/* Icon */}
        <View style={[styles.iconWrap, {
          backgroundColor: item.color + "22",
        }]}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>

        {/* Label */}
        <View style={styles.rowBody}>
          <Text style={[styles.rowLabel, { color: tokens.text }]}>
            {item.label}
          </Text>
        </View>

        {/* Right */}
        <View style={styles.rowRight}>
          {/* Item count badge */}
          <View style={[styles.badge, { backgroundColor: tokens.bg }]}>
            <Text style={[styles.badgeText, { color: tokens.muted }]}>
              {count}
            </Text>
          </View>

          {/* Edit & Delete — hanya untuk custom */}
          {!item.isDefault && (
            <>
              <TouchableOpacity
                onPress={() => handleEdit(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={[styles.actionBtn, { backgroundColor: tokens.bg }]}
              >
                <Ionicons name="pencil-outline" size={16} color={tokens.muted} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={[styles.actionBtn, { backgroundColor: tokens.bg }]}
              >
                <Ionicons name="trash-outline" size={16} color={colors.brand.danger} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
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
              {defaultCategories.map((cat) =>
                renderCategoryRow(cat, false)
              )}
            </View>

            {/* Custom Categories */}
            {customCategories.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, {
                  color: tokens.muted,
                  marginTop: 24,
                }]}>
                  {t("category.section_custom")}
                </Text>
                <View style={styles.group}>
                  {customCategories.map((cat) =>
                    renderCategoryRow(cat, true)
                  )}
                </View>
              </>
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

            {/* Empty custom state */}
            {customCategories.length === 0 && (
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
          </>
        )}
      </ScrollView>

      <CategoryFormSheet
        visible={sheetVisible}
        editItem={editItem}
        onClose={() => setSheetVisible(false)}
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
    fontSize: 11, letterSpacing: 1.5,
    textTransform: "uppercase", marginBottom: 10,
  },
  group: { gap: 8 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    borderWidth: 0.5,
    gap: 10,
  },
  dragDisabled: { opacity: 0.3 },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 20 },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: "500" },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: { fontSize: 11 },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

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

  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 16,
    marginTop: 16,
  },
  emptyText: { fontSize: 14, fontWeight: "500" },
  addText: { fontSize: 14, fontWeight: "500" },
});