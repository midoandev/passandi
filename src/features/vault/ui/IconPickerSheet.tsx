import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppBar } from "@/shared/ui/AppBar";
import { EMOJI_GROUPS, IONICON_GROUPS, ICON_COLORS } from "../model/iconData";
import type { IconType } from "@/entities/vault";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

type Props = {
  visible: boolean;
  iconType: IconType;
  iconValue: string;
  iconColor: string;
  onClose: () => void;
  onChange: (type: IconType, value: string, color: string) => void;
};

const TABS: { key: IconType; label: string }[] = [
  { key: "emoji", label: "Emoji" },
  { key: "ionicon", label: "Icon" },
  { key: "color", label: "Warna" },
];

export function IconPickerSheet({
  visible,
  iconType,
  iconValue,
  iconColor,
  onClose,
  onChange,
}: Props) {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const [activeTab, setActiveTab] = useState<IconType>(iconType);
  const [selValue, setSelValue] = useState(iconValue);
  const [selColor, setSelColor] = useState(iconColor);

  const handleSave = () => {
    onChange(activeTab, selValue, selColor);
    onClose();
  };

  const renderPreview = () => (
    <View style={styles.previewWrap}>
      <View
        style={[
          styles.preview,
          { backgroundColor: selColor + "22", borderColor: selColor + "66" },
        ]}
      >
        {activeTab === "emoji" ? (
          <Text style={styles.previewEmoji}>{selValue}</Text>
        ) : activeTab === "ionicon" ? (
          <Ionicons name={selValue as any} size={32} color={selColor} />
        ) : (
          <View style={[styles.colorBlock, { backgroundColor: selColor }]} />
        )}
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabs, { borderColor: tokens.border }]}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => {
            setActiveTab(tab.key);
            // Set default value saat ganti tab
            if (tab.key === "emoji") setSelValue("🔐");
            if (tab.key === "ionicon") setSelValue("shield-outline");
            if (tab.key === "color") setSelValue("color");
          }}
          style={[
            styles.tab,
            activeTab === tab.key && {
              backgroundColor: colors.brand.blue,
              borderRadius: 8,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === tab.key ? "#fff" : tokens.muted },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderColors = () => (
    <View>
      <Text style={[styles.groupLabel, { color: tokens.muted }]}>
        Warna Background
      </Text>
      <View style={styles.colorGrid}>
        {ICON_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setSelColor(c)}
            style={[
              styles.colorDot,
              { backgroundColor: c },
              selColor === c && styles.colorDotSelected,
            ]}
          >
            {selColor === c && (
              <Ionicons name="checkmark" size={14} color="#fff" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmojiContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {renderColors()}
      {EMOJI_GROUPS.map((group) => (
        <View key={group.label} style={styles.group}>
          <Text style={[styles.groupLabel, { color: tokens.muted }]}>
            {group.label}
          </Text>
          <View style={styles.emojiGrid}>
            {group.emojis.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => setSelValue(emoji)}
                style={[
                  styles.emojiItem,
                  {
                    backgroundColor:
                      selValue === emoji ? selColor + "22" : tokens.surface,
                    borderColor: selValue === emoji ? selColor : tokens.border,
                  },
                ]}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderIoniconContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {renderColors()}
      {IONICON_GROUPS.map((group) => (
        <View key={group.label} style={styles.group}>
          <Text style={[styles.groupLabel, { color: tokens.muted }]}>
            {group.label}
          </Text>
          <View style={styles.emojiGrid}>
            {group.icons.map((icon) => (
              <TouchableOpacity
                key={icon}
                onPress={() => setSelValue(icon)}
                style={[
                  styles.emojiItem,
                  {
                    backgroundColor:
                      selValue === icon ? selColor + "22" : tokens.surface,
                    borderColor: selValue === icon ? selColor : tokens.border,
                  },
                ]}
              >
                <Ionicons
                  name={icon as any}
                  size={22}
                  color={selValue === icon ? selColor : tokens.muted}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderColorContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={[styles.groupLabel, { color: tokens.muted }]}>
        Pilih Warna Solid
      </Text>
      <View style={styles.colorGridLarge}>
        {ICON_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => {
              setSelColor(c);
              setSelValue("color");
            }}
            style={[
              styles.colorBlockLarge,
              { backgroundColor: c },
              selColor === c && styles.colorDotSelected,
            ]}
          >
            {selColor === c && (
              <Ionicons name="checkmark" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.flex, { backgroundColor: tokens.bg }]}>
        <AppBar
          title="Pilih Icon"
          onBack={onClose}
          right={
            <TouchableOpacity onPress={handleSave}>
              <Text
                style={{
                  color: colors.brand.blue,
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                {t("common.save")}
              </Text>
            </TouchableOpacity>
          }
        />
        <View style={styles.content}>
          {renderPreview()}
          {renderTabs()}
          <View style={styles.pickerContent}>
            {activeTab === "emoji" && renderEmojiContent()}
            {activeTab === "ionicon" && renderIoniconContent()}
            {activeTab === "color" && renderColorContent()}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20 },
  previewWrap: { alignItems: "center", paddingVertical: 16 },
  preview: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  previewEmoji: { fontSize: 32 },
  colorBlock: { width: 32, height: 32, borderRadius: 8 },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#162235",
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 4,
    marginBottom: 16,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 7 },
  tabText: { fontSize: 12, fontWeight: "500" },
  pickerContent: { flex: 1 },
  group: { marginBottom: 16 },
  groupLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  emojiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  emojiItem: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  emojiText: { fontSize: 22 },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  colorDotSelected: { borderWidth: 2.5, borderColor: "#fff" },
  colorGridLarge: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  colorBlockLarge: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
