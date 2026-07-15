import {
  View, Text, TouchableOpacity, Modal,
  ScrollView, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={[styles.sheet, {
          backgroundColor: tokens.surface,
          paddingBottom: insets.bottom + 16,
        }]}>
          <View style={styles.handle} />
          <Text style={[styles.title, { color: tokens.text }]}>{title}</Text>

          <ScrollView bounces={false}>
            {options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    onSelect(opt.value);
                    onClose();
                  }}
                  activeOpacity={0.7}
                  style={[styles.option, {
                    backgroundColor: isSelected ? colors.brand.blue + "11" : "transparent",
                    borderColor: tokens.border,
                  }]}
                >
                  <Text style={[styles.optionText, {
                    color: isSelected ? colors.brand.blue : tokens.text,
                    fontWeight: isSelected ? "600" : "400",
                  }]}>
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.brand.blue} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    maxHeight: "70%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 15,
  },
});
