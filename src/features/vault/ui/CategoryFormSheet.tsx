import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppInput } from "@/shared/ui/AppInput";
import { AppButton } from "@/shared/ui/AppButton";
import { useTranslation } from "react-i18next";
import type { VaultCategory } from "@/entities/vault";

const EMOJI_OPTIONS = [
  "🏦", "💳", "💬", "📸", "🎬", "🛍️", "💼", "🔐",
  "📧", "📱", "🏠", "🚗", "✈️", "🎓", "💊", "🔧",
  "🌐", "🎮", "🎵", "📊", "💰", "🏧", "🛡️", "🗂️",
];

const COLOR_OPTIONS = [
  "#2563EB", "#10B981", "#8B5CF6", "#F59E0B",
  "#EF4444", "#EC4899", "#06B6D4", "#6B7280",
];

type Props = {
  visible: boolean;
  editItem?: VaultCategory | null;
  onClose: () => void;
  onSave: (label: string, icon: string, color: string) => void;
  loading?: boolean;
};

export function CategoryFormSheet({
  visible, editItem, onClose, onSave, loading,
}: Props) {
  const { t } = useTranslation();
  const { tokens } = useTheme();

  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("📁");
  const [selColor, setSelColor] = useState(COLOR_OPTIONS[0]);

  useEffect(() => {
    if (editItem) {
      setLabel(editItem.label);
      setIcon(editItem.icon);
      setSelColor(editItem.color);
    } else {
      setLabel("");
      setIcon("📁");
      setSelColor(COLOR_OPTIONS[0]);
    }
  }, [editItem, visible]);

  const handleSave = () => {
    if (!label.trim()) return;
    onSave(label.trim(), icon, selColor);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.sheetWrap}
      >
        <View style={[styles.sheet, { backgroundColor: tokens.surface, borderColor: tokens.border }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: tokens.border }]} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: tokens.text }]}>
              {editItem ? t("common.edit") : t("common.add")}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={tokens.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Preview */}
            <View style={styles.previewRow}>
              <View style={[styles.preview, {
                backgroundColor: selColor + "22",
                borderColor: selColor + "66",
              }]}>
                <Text style={styles.previewEmoji}>{icon}</Text>
              </View>
              <Text style={[styles.previewLabel, { color: tokens.text }]}>
                {label || t("category.name_placeholder")}
              </Text>
            </View>

            {/* Nama */}
            <AppInput
              label={t("category.name_label")}
              placeholder={t("category.name_placeholder")}
              value={label}
              onChangeText={setLabel}
              maxLength={20}
            />
            <Text style={[styles.charCount, { color: tokens.subtle }]}>
              {label.length}/20
            </Text>

            {/* Pilih Emoji */}
            <Text style={[styles.sectionLabel, { color: tokens.muted }]}>
              {t("common.choose_icon")}
            </Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((e) => (
                <TouchableOpacity
                  key={e}
                  onPress={() => setIcon(e)}
                  style={[styles.emojiItem, {
                    backgroundColor: icon === e ? selColor + "22" : tokens.bg,
                    borderColor: icon === e ? selColor : tokens.border,
                  }]}
                >
                  <Text style={styles.emojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Pilih Warna */}
            <Text style={[styles.sectionLabel, { color: tokens.muted }]}>
              {t("common.choose_color")}
            </Text>
            <View style={styles.colorRow}>
              {COLOR_OPTIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelColor(c)}
                  style={[styles.colorDot, { backgroundColor: c },
                  selColor === c && styles.colorDotSelected,
                  ]}
                >
                  {selColor === c && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <AppButton
              label={editItem ? t("common.save") : t("category.btn_add")}
              onPress={handleSave}
              loading={loading}
              style={styles.saveBtn}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheetWrap: { justifyContent: "flex-end", flex: 1 },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    padding: 20,
    paddingBottom: 40,
    maxHeight: "85%",
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: "center", marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 17, fontWeight: "600" },

  previewRow: {
    flexDirection: "row", alignItems: "center",
    gap: 12, marginBottom: 20,
  },
  preview: {
    width: 52, height: 52, borderRadius: 14,
    borderWidth: 1.5, borderStyle: "dashed",
    alignItems: "center", justifyContent: "center",
  },
  previewEmoji: { fontSize: 24 },
  previewLabel: { fontSize: 16, fontWeight: "500", flex: 1 },

  charCount: { fontSize: 11, textAlign: "right", marginTop: -8, marginBottom: 14 },

  sectionLabel: {
    fontSize: 11, letterSpacing: 1.5,
    textTransform: "uppercase", marginBottom: 10,
  },
  emojiGrid: {
    flexDirection: "row", flexWrap: "wrap",
    gap: 8, marginBottom: 20,
  },
  emojiItem: {
    width: 44, height: 44, borderRadius: 10,
    alignItems: "center", justifyContent: "center", borderWidth: 1,
  },
  emojiText: { fontSize: 22 },
  colorRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  colorDot: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  colorDotSelected: { borderWidth: 2.5, borderColor: "#fff" },
  saveBtn: { marginTop: 4 },
});