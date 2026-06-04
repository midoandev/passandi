import {
  View, Text, TouchableOpacity,
  Switch, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";

type SettingRowProps = {
  icon: string;
  iconBg: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightText?: string;
  switchValue?: boolean;
  onSwitch?: (val: boolean) => void;
  isPremium?: boolean;
  isDanger?: boolean;
  isFirst?: boolean;
};

export function SettingRow({
  icon, iconBg, iconColor,
  title, subtitle, onPress,
  rightText, switchValue, onSwitch,
  isPremium, isDanger, isFirst,
}: SettingRowProps) {
  const { tokens } = useTheme();

  const titleColor = isDanger ? colors.brand.danger : tokens.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.row,
        !isFirst && { borderTopWidth: 0.5, borderTopColor: tokens.border },
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={[styles.title, { color: titleColor }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.sub, { color: tokens.subtle }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right */}
      <View style={styles.right}>
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={10} color={colors.brand.gold} />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
        {onSwitch !== undefined ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitch}
            trackColor={{ true: colors.brand.blue, false: tokens.border }}
            thumbColor="#fff"
          />
        ) : rightText ? (
          <Text style={[styles.rightText, { color: tokens.subtle }]}>
            {rightText}
          </Text>
        ) : null}
        {onPress && !onSwitch && (
          <Ionicons name="chevron-forward" size={16} color={tokens.border} />
        )}
      </View>
    </TouchableOpacity>
  );
}

type SettingGroupProps = {
  label?: string;
  children: React.ReactNode;
  style?: any;
};

export function SettingGroup({ label, children, style }: SettingGroupProps) {
  const { tokens } = useTheme();
  return (
    <View style={style}>
      {label && (
        <Text style={[styles.groupLabel, { color: tokens.subtle }]}>
          {label}
        </Text>
      )}
      <View style={[styles.group, {
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
      }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  iconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 16 },
  body: { flex: 1 },
  title: { fontSize: 14 },
  sub: { fontSize: 11, marginTop: 2 },
  right: { flexDirection: "row", alignItems: "center", gap: 6 },
  rightText: { fontSize: 13 },
  premiumBadge: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: colors.brand.gold + "22",
    borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 0.5, borderColor: colors.brand.gold + "44",
  },
  premiumText: { fontSize: 10, color: colors.brand.gold, fontWeight: "500" },
  groupLabel: {
    fontSize: 11, letterSpacing: 1.5,
    textTransform: "uppercase", marginBottom: 8, paddingHorizontal: 4,
  },
  group: { borderRadius: 14, borderWidth: 0.5, overflow: "hidden" },
});