import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { AppInput } from "@/shared/ui/AppInput";
import { isSystemCategory } from "@/shared/config/categoryHelpers";
import { IconPickerSheet } from "./IconPickerSheet";
import { CustomFieldItem } from "./CustomFieldItem";
import {
  useCategories,
  useCreateVaultItem,
  useUpdateVaultItem,
} from "../model/useVaultQuery";
import type { VaultItemForm, CustomField, IconType } from "@/entities/vault";
import { ICON_COLORS } from "../model/iconData";
import { useVaultItems } from "../model/useVaultQuery";
import { AppButton } from "../../../shared/ui";

const DEFAULT_FORM: VaultItemForm = {
  title: "",
  categoryId: "other",
  isFavorite: false,
  iconType: "ionicon",
  iconValue: "shield",
  iconColor: ICON_COLORS[0],
  username: "",
  email: "",
  password: "",
  pin: "",
  phone: "",
  url: "",
  notes: "",
  holderName: "",
  expiredDate: "",
  customFields: [],
};

export function VaultFormScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  // Jika ada id → mode edit
  const { data: items = [] } = useVaultItems();
  const existingItem = id ? items.find((i) => i.id === id) : null;

  const [form, setForm] = useState<VaultItemForm>(() => {
    if (existingItem) {
      const {
        id: _,
        userId: __,
        createdAt: ___,
        updatedAt: ____,
        ...rest
      } = existingItem as any;
      return rest;
    }
    return DEFAULT_FORM;
  });

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [activeSection, setActiveSection] = useState<"main" | "extra">("main");

  const { data: categories = [] } = useCategories();
  const createItem = useCreateVaultItem();
  const updateItem = useUpdateVaultItem();
  const isLoading = createItem.isPending || updateItem.isPending;

  const update = useCallback(
    <K extends keyof VaultItemForm>(key: K, value: VaultItemForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleIconChange = (type: IconType, value: string, color: string) => {
    setForm((prev) => ({
      ...prev,
      iconType: type,
      iconValue: value,
      iconColor: color,
    }));
  };

  const addCustomField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: "",
      value: "",
      isSecret: false,
    };
    update("customFields", [...form.customFields, newField]);
  };

  const updateCustomField = (updated: CustomField) => {
    update(
      "customFields",
      form.customFields.map((f) => (f.id === updated.id ? updated : f)),
    );
  };

  const deleteCustomField = (fieldId: string) => {
    update(
      "customFields",
      form.customFields.filter((f) => f.id !== fieldId),
    );
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert(t("common.error"), t("vault.error_title_required"));
      return;
    }

    try {
      if (id) {
        await updateItem.mutateAsync({ id, form });
      } else {
        await createItem.mutateAsync(form);
      }
      router.back();
    } catch (e: any) {
      console.log("Save error:", e); // ← lihat error detail di console
      Alert.alert(t("common.error"), e?.message ?? t("vault.error_save"));
    }
  };

  const renderIconPreview = () => (
    <TouchableOpacity
      onPress={() => setShowIconPicker(true)}
      style={[
        styles.iconPreviewWrap,
        {
          backgroundColor: form.iconColor + "22",
          borderColor: form.iconColor + "66",
        },
      ]}
    >
      {form.iconType === "emoji" ? (
        <Text style={styles.iconEmoji}>{form.iconValue}</Text>
      ) : form.iconType === "ionicon" ? (
        <Ionicons
          name={form.iconValue as any}
          size={32}
          color={form.iconColor}
        />
      ) : (
        <View
          style={[styles.iconColorBlock, { backgroundColor: form.iconColor }]}
        />
      )}
      <View style={[styles.iconEditBadge, { backgroundColor: tokens.surface }]}>
        <Ionicons name="pencil" size={10} color={tokens.muted} />
      </View>
    </TouchableOpacity>
  );

  const renderSectionTabs = () => (
    <View
      style={[
        styles.sectionTabs,
        { backgroundColor: tokens.surface, borderColor: tokens.border },
      ]}
    >
      {(["main", "extra"] as const).map((s) => (
        <TouchableOpacity
          key={s}
          onPress={() => setActiveSection(s)}
          style={[
            styles.sectionTab,
            activeSection === s && {
              backgroundColor: colors.brand.blue,
              borderRadius: 8,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTabText,
              { color: activeSection === s ? "#fff" : tokens.muted },
            ]}
          >
            {s === "main" ? t("vault.section_main") : t("common.extra_info")}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMainSection = () => (
    <View style={styles.section}>
      {/* Icon Picker */}
      <View style={styles.iconRow}>
        {renderIconPreview()}
        <View style={styles.iconRight}>
          <AppInput
            label={t("vault.field_title")}
            placeholder={t("vault.field_title_placeholder")}
            value={form.title}
            onChangeText={(v) => update("title", v)}
          />
          {/* Favorite Toggle */}
          {/* <View style={styles.favoriteRow}>
            <Ionicons
              name={form.isFavorite ? "star" : "star-outline"}
              size={16}
              color={form.isFavorite ? colors.brand.gold : tokens.muted}
            />
            <Text style={[styles.favoriteLabel, { color: tokens.muted }]}>
              {t("vault.mark_favorite")}
            </Text>
            <Switch
              value={form.isFavorite}
              onValueChange={(v) => update("isFavorite", v)}
              trackColor={{ true: colors.brand.gold, false: tokens.border }}
              thumbColor="#fff"
            />
          </View> */}
        </View>
      </View>

      {/* Kategori */}
      <Text style={[styles.fieldLabel, { color: tokens.muted }]}>
        {t("vault.field_category")}
      </Text>
      {/* Category Chips di form — exclude all & favorite */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catList}
      >
        {categories
          .filter((c) => !isSystemCategory(c))
          .map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => update("categoryId", cat.id)}
              style={[
                styles.catChip,
                form.categoryId === cat.id
                  ? { backgroundColor: colors.brand.blue }
                  : {
                    backgroundColor: tokens.surface,
                    borderWidth: 0.5,
                    borderColor: tokens.border,
                  },
              ]}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[
                styles.catLabel,
                { color: form.categoryId === cat.id ? "#fff" : tokens.muted },
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* Core Fields */}
      <Text
        style={[
          styles.sectionLabel,
          { color: tokens.muted, borderColor: tokens.border },
        ]}
      >
        {t("common.account_info")}
      </Text>
      <AppInput
        label={t("common.username")}
        placeholder={t("vault.field_username_placeholder")}
        value={form.username ?? ""}
        onChangeText={(v) => update("username", v)}
      />
      <AppInput
        label={t("common.email")}
        placeholder={t("vault.field_email_placeholder")}
        value={form.email ?? ""}
        onChangeText={(v) => update("email", v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AppInput
        label={t("common.password")}
        placeholder={t("vault.field_password_placeholder")}
        value={form.password ?? ""}
        onChangeText={(v) => update("password", v)}
        isPassword
      />
    </View>
  );

  const renderExtraSection = () => (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionLabel,
          { color: tokens.muted, borderColor: tokens.border },
        ]}
      >
        {t("common.extra_info")}
      </Text>
      <AppInput
        label={t("common.pin")}
        placeholder={t("vault.field_pin_placeholder")}
        value={form.pin ?? ""}
        onChangeText={(v) => update("pin", v)}
        isPassword
        keyboardType="number-pad"
      />
      <AppInput
        label={t("common.phone")}
        placeholder={t("vault.field_phone_placeholder")}
        value={form.phone ?? ""}
        onChangeText={(v) => update("phone", v)}
        keyboardType="phone-pad"
      />
      <AppInput
        label={t("common.url")}
        placeholder={t("vault.field_url_placeholder")}
        value={form.url ?? ""}
        onChangeText={(v) => update("url", v)}
        keyboardType="url"
        autoCapitalize="none"
      />
      <AppInput
        label={t("common.holder")}
        placeholder={t("vault.field_holder_name_placeholder")}
        value={form.holderName ?? ""}
        onChangeText={(v) => update("holderName", v)}
      />
      <AppInput
        label={t("common.expiry_date")}
        placeholder={t("vault.field_expired_date_placeholder")}
        value={form.expiredDate ?? ""}
        onChangeText={(v) => update("expiredDate", v)}
      />
      <AppInput
        label={t("common.notes")}
        placeholder={t("vault.field_notes_placeholder")}
        value={form.notes ?? ""}
        onChangeText={(v) => update("notes", v)}
        multiline
        numberOfLines={3}
      />

      {/* Custom Fields */}
      <Text
        style={[
          styles.sectionLabel,
          { color: tokens.muted, borderColor: tokens.border },
        ]}
      >
        {t("common.custom_fields")}
      </Text>

      {form.customFields.map((field) => (
        <CustomFieldItem
          key={field.id}
          field={field}
          onUpdate={updateCustomField}
          onDelete={deleteCustomField}
        />
      ))}

      <TouchableOpacity
        onPress={addCustomField}
        style={[
          styles.addFieldBtn,
          {
            backgroundColor: tokens.surface,
            borderColor: colors.brand.blue + "44",
          },
        ]}
      >
        <Ionicons
          name="add-circle-outline"
          size={18}
          color={colors.brand.blue}
        />
        <Text style={[styles.addFieldText, { color: colors.brand.blue }]}>
          {t("vault.add_custom_field")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <AppBar
        title={id ? t("vault.edit_item") : t("vault.add_item")}
        right={
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={"save-outline"}
              size={20}
              color={tokens.text}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderSectionTabs()}
        {activeSection === "main" && renderMainSection()}
        {activeSection === "extra" && renderExtraSection()}
      </ScrollView>

      <IconPickerSheet
        visible={showIconPicker}
        iconType={form.iconType}
        iconValue={form.iconValue}
        iconColor={form.iconColor}
        onClose={() => setShowIconPicker(false)}
        onChange={handleIconChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },

  sectionTabs: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 4,
    marginBottom: 20,
  },
  sectionTab: { flex: 1, alignItems: "center", paddingVertical: 8 },
  sectionTabText: { fontSize: 13, fontWeight: "500" },

  section: { gap: 0 },

  iconRow: { flexDirection: "row", gap: 14, marginBottom: 16 },
  iconPreviewWrap: {
    width: 80,
    height: 80,
    borderRadius: 22,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexShrink: 0,
  },
  iconEmoji: { fontSize: 34 },
  iconColorBlock: { width: 36, height: 36, borderRadius: 10 },
  iconEditBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconRight: { flex: 1 },

  favoriteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -4,
  },
  favoriteLabel: { flex: 1, fontSize: 13 },

  fieldLabel: { fontSize: 11, letterSpacing: 0.5, marginBottom: 6 },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    marginTop: 8,
    marginBottom: 14,
  },

  catList: { gap: 8, marginBottom: 16 },
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

  addFieldBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 14,
    marginTop: 4,
  },
  addFieldText: { fontSize: 14, fontWeight: "500" },
  saveText: { fontSize: 15, fontWeight: "500" },
});
