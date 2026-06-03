import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import { AppInput } from "@/shared/ui/AppInput";
import type { CustomField } from "@/entities/vault";

type Props = {
  field: CustomField;
  onUpdate: (field: CustomField) => void;
  onDelete: (id: string) => void;
};

export function CustomFieldItem({ field, onUpdate, onDelete }: Props) {
  const { tokens } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: tokens.surface,
          borderColor: tokens.border,
        },
      ]}
    >
      <AppInput
        label="Label Field"
        placeholder="contoh: Kode Recovery"
        value={field.label}
        onChangeText={(v) => onUpdate({ ...field, label: v })}
      />
      <AppInput
        label="Nilai"
        placeholder="Isi nilai field"
        value={field.value}
        isPassword={field.isSecret}
        onChangeText={(v) => onUpdate({ ...field, value: v })}
      />
      <View style={styles.footer}>
        <View style={styles.secretRow}>
          <Text style={[styles.secretLabel, { color: tokens.muted }]}>
            Sembunyikan nilai
          </Text>
          <Switch
            value={field.isSecret}
            onValueChange={(v) => onUpdate({ ...field, isSecret: v })}
            trackColor={{ true: colors.brand.blue, false: tokens.border }}
            thumbColor="#fff"
          />
        </View>
        <TouchableOpacity onPress={() => onDelete(field.id)}>
          <Ionicons
            name="trash-outline"
            size={18}
            color={colors.brand.danger}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  secretRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  secretLabel: { fontSize: 12 },
});
