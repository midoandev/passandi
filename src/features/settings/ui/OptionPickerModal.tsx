import {
  View, Text, TouchableOpacity,
  Modal, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";

type Option = { label: string; value: string };

type Props = {
  visible: boolean;
  title: string;
  options: Option[];
  selected: string;
  onSelect: (val: string) => void;
  onClose: () => void;
};

export function OptionPickerModal({
  visible, title, options, selected, onSelect, onClose,
}: Props) {
  const { tokens } = useTheme();

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
      <View style={[styles.sheet, {
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
      }]}>
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: tokens.border }]} />

        <Text style={[styles.title, { color: tokens.text }]}>{title}</Text>

        {options.map((opt, i) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => { onSelect(opt.value); onClose(); }}
            style={[styles.option, {
              borderTopWidth: i > 0 ? 0.5 : 0,
              borderTopColor: tokens.border,
              backgroundColor: selected === opt.value
                ? colors.brand.blue + "11"
                : "transparent",
            }]}
          >
            <Text style={[styles.optionText, {
              color: selected === opt.value ? colors.brand.blue : tokens.text,
              fontWeight: selected === opt.value ? "500" : "400",
            }]}>
              {opt.label}
            </Text>
            {selected === opt.value && (
              <Ionicons name="checkmark" size={18} color={colors.brand.blue} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 0.5,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: "center", marginBottom: 20,
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  optionText: { fontSize: 15 },
});