import { useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { DetailField } from "./DetailField";
import {
  useVaultItems,
  useDeleteVaultItem,
  useToggleFavorite,
} from "../model/useVaultQuery";

export function VaultDetailScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: items = [] } = useVaultItems();
  const deleteItem = useDeleteVaultItem();
  const toggleFavorite = useToggleFavorite();

  const item = items.find((i) => i.id === id);

  const handleEdit = useCallback(() => {
    router.push({ pathname: "/vault-form", params: { id } });
  }, [id]);

  const handleDelete = useCallback(() => {
    if (!item) return;
    Alert.alert(
      t("detail.delete"),
      t("detail.delete_confirm", { name: item.title }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await deleteItem.mutateAsync(item.id);
            router.back();
          },
        },
      ]
    );
  }, [item]);

  const handleToggleFavorite = useCallback(() => {
    if (!item) return;
    toggleFavorite.mutate({ id: item.id, current: item.isFavorite });
  }, [item]);

  const handleOpenUrl = useCallback(() => {
    if (!item?.url) return;
    const url = item.url.startsWith("http") ? item.url : `https://${item.url}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(t("common.error"), "Tidak bisa membuka URL ini.");
    });
  }, [item?.url]);

  if (!item) {
    return (
      <View style={[styles.flex, {
        backgroundColor: tokens.bg,
        justifyContent: "center",
        alignItems: "center",
      }]}>
        <Text style={{ color: tokens.muted }}>Item tidak ditemukan</Text>
      </View>
    );
  }

  const hasExtraInfo = item.pin || item.phone || item.url
    || item.holderName || item.expiredDate || item.notes;

  const hasCustomFields = item.customFields?.length > 0;

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      {/* AppBar */}
      <AppBar
        title={t("detail.title")}
        right={
          <View style={styles.appBarRight}>
            {/* Favorite */}
            <TouchableOpacity
              onPress={handleToggleFavorite}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={item.isFavorite ? "star" : "star-outline"}
                size={22}
                color={item.isFavorite ? colors.brand.gold : tokens.muted}
              />
            </TouchableOpacity>

            {/* Edit */}
            <TouchableOpacity
              onPress={handleEdit}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil-outline" size={20} color={tokens.muted} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, {
          paddingBottom: insets.bottom + 120,
        }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — Icon + Title + Category */}
        <View style={[styles.hero, {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        }]}>
          <View style={[styles.heroIcon, {
            backgroundColor: item.iconColor + "22",
          }]}>
            {item.iconType === "emoji" ? (
              <Text style={styles.heroEmoji}>{item.iconValue}</Text>
            ) : item.iconType === "ionicon" ? (
              <Ionicons
                name={item.iconValue as any}
                size={32}
                color={item.iconColor}
              />
            ) : (
              <View style={[styles.heroColorBlock, {
                backgroundColor: item.iconColor,
              }]} />
            )}
          </View>

          <View style={styles.heroBody}>
            <Text style={[styles.heroTitle, { color: tokens.text }]}>
              {item.title}
            </Text>
            <View style={styles.heroBadgeRow}>
              <View style={[styles.heroBadge, { backgroundColor: item.iconColor + "22" }]}>
                <Text style={[styles.heroBadgeText, { color: item.iconColor }]}>
                  {item.categoryId}
                </Text>
              </View>
              {item.isFavorite && (
                <View style={[styles.heroBadge, { backgroundColor: colors.brand.gold + "22" }]}>
                  <Ionicons name="star" size={10} color={colors.brand.gold} />
                  <Text style={[styles.heroBadgeText, { color: colors.brand.gold }]}>
                    Favorit
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Aksi Cepat */}
        <View style={styles.quickActions}>
          {item.url && (
            <TouchableOpacity
              onPress={handleOpenUrl}
              style={[styles.quickBtn, {
                backgroundColor: tokens.surface,
                borderColor: tokens.border,
              }]}
            >
              <Ionicons name="globe-outline" size={18} color={colors.brand.blue} />
              <Text style={[styles.quickBtnText, { color: colors.brand.blue }]}>
                {t("detail.open_url")}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleEdit}
            style={[styles.quickBtn, {
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            }]}
          >
            <Ionicons name="pencil-outline" size={18} color={tokens.muted} />
            <Text style={[styles.quickBtnText, { color: tokens.muted }]}>
              {t("detail.edit")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.quickBtn, {
              backgroundColor: colors.brand.danger + "11",
              borderColor: colors.brand.danger + "33",
            }]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.brand.danger} />
            <Text style={[styles.quickBtnText, { color: colors.brand.danger }]}>
              {t("detail.delete")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Akun */}
        <Text style={[styles.sectionLabel, { color: tokens.muted }]}>
          {t("detail.section_account")}
        </Text>

        <DetailField
          label={t("detail.field_username")}
          value={item.username ?? ""}
          copyLabel="Username"
        />
        <DetailField
          label={t("detail.field_email")}
          value={item.email ?? ""}
          copyLabel="Email"
        />
        <DetailField
          label={t("detail.field_password")}
          value={item.password ?? ""}
          isSecret
          copyLabel="Password"
        />

        {/* Info Tambahan */}
        {hasExtraInfo && (
          <>
            <Text style={[styles.sectionLabel, {
              color: tokens.muted,
              marginTop: 8,
            }]}>
              {t("detail.section_extra")}
            </Text>

            <DetailField
              label={t("detail.field_pin")}
              value={item.pin ?? ""}
              isSecret
              copyLabel="PIN"
            />
            <DetailField
              label={t("detail.field_phone")}
              value={item.phone ?? ""}
              copyLabel="Nomor Telepon"
            />
            <DetailField
              label={t("detail.field_url")}
              value={item.url ?? ""}
              copyLabel="URL"
            />
            <DetailField
              label={t("detail.field_holder")}
              value={item.holderName ?? ""}
              copyLabel="Nama Pemegang"
            />
            <DetailField
              label={t("detail.field_expired")}
              value={item.expiredDate ?? ""}
              copyLabel="Expired"
            />
            <DetailField
              label={t("detail.field_notes")}
              value={item.notes ?? ""}
              copyLabel="Catatan"
            />
          </>
        )}

        {/* Custom Fields */}
        {hasCustomFields && (
          <>
            <Text style={[styles.sectionLabel, {
              color: tokens.muted,
              marginTop: 8,
            }]}>
              {t("detail.section_custom")}
            </Text>
            {item.customFields.map((field: any) => (
              <DetailField
                key={field.id}
                label={field.label}
                value={field.value}
                isSecret={field.isSecret}
                copyLabel={field.label}
              />
            ))}
          </>
        )}

        {/* Metadata */}
        <View style={[styles.meta, { borderColor: tokens.border }]}>
          <Text style={[styles.metaText, { color: tokens.subtle }]}>
            Dibuat: {new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </Text>
          <Text style={[styles.metaText, { color: tokens.subtle }]}>
            Diperbarui: {new Date(item.updatedAt).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },

  appBarRight: { flexDirection: "row", alignItems: "center", gap: 12 },

  // Hero
  hero: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    gap: 14,
    marginBottom: 16,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  heroEmoji: { fontSize: 30 },
  heroColorBlock: { width: 32, height: 32, borderRadius: 8 },
  heroBody: { flex: 1 },
  heroTitle: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  heroBadgeRow: { flexDirection: "row", gap: 6 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  heroBadgeText: { fontSize: 11, fontWeight: "500" },

  // Quick Actions
  quickActions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  quickBtn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  quickBtnText: { fontSize: 11, fontWeight: "500" },

  // Section
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  // Metadata
  meta: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 0.5,
    gap: 4,
  },
  metaText: { fontSize: 11 },
});