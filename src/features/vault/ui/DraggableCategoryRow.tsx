import { useRef } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import type { VaultCategory } from "@/entities/vault";

const ITEM_HEIGHT = 66;

type Props = {
  item: VaultCategory;
  index: number;
  totalCount: number;
  itemCount: number;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, newIndex: number) => void;
  onEdit: (item: VaultCategory) => void;
  onDelete: (item: VaultCategory) => void;
  isSystem: boolean;
};

export function DraggableCategoryRow({ isSystem,
  item, index, totalCount, itemCount,
  isDragging, onDragStart, onDragEnd,
  onEdit, onDelete,
}: Props) {
  const { tokens } = useTheme();
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);
  const startY = useRef(0);

  const panGesture = Gesture.Pan()
    .enabled(!isSystem)
    .onBegin(() => {
      startY.current = 0;
      scale.value = withSpring(1.04);
      zIndex.value = 999;
      runOnJS(onDragStart)(item.id);
    })
    .onUpdate((e) => {
      translateY.value = e.translationY;
      startY.current = e.translationY;
    })
    .onEnd(() => {
      const movedIndexes = Math.round(startY.current / ITEM_HEIGHT);
      const newIndex = Math.max(
        0,
        Math.min(totalCount - 1, index + movedIndexes)
      );

      translateY.value = withSpring(0, { damping: 20 });
      scale.value = withSpring(1);
      zIndex.value = 0;
      runOnJS(onDragEnd)(item.id, newIndex);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    zIndex: zIndex.value,
    shadowOpacity: isDragging ? 0.15 : 0,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle]}>
        <View style={[styles.row, {
          backgroundColor: tokens.surface,
          borderColor: isDragging ? colors.brand.blue + "44" : tokens.border,
        }]}>
          {/* Drag Handle */}
          <View style={styles.handle}>
            <Ionicons
              name="reorder-three"
              size={24}
              color={isSystem ? tokens.border : tokens.muted}
            />
          </View>

          {/* Icon */}
          <View style={[styles.iconWrap, {
            backgroundColor: item.color + "22",
          }]}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>

          {/* Label */}
          <View style={styles.body}>
            <Text style={[styles.label, { color: tokens.text }]}>
              {item.label}
            </Text>
          </View>

          {/* Right */}
          <View style={styles.right}>
            <View style={[styles.badge, { backgroundColor: tokens.bg }]}>
              <Text style={[styles.badgeText, { color: tokens.muted }]}>
                {itemCount}
              </Text>
            </View>

            {!isSystem && (
              <>
                <TouchableOpacity
                  onPress={() => onEdit(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  style={[styles.actionBtn, { backgroundColor: tokens.bg }]}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={15}
                    color={tokens.muted}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  style={[styles.actionBtn, { backgroundColor: tokens.bg }]}
                >
                  <Ionicons
                    name="trash-outline"
                    size={15}
                    color={colors.brand.danger}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    borderWidth: 0.5,
    height: ITEM_HEIGHT,
    gap: 10,
  },
  handle: { paddingHorizontal: 2 },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 20 },
  body: { flex: 1 },
  label: { fontSize: 14, fontWeight: "500" },
  right: { flexDirection: "row", alignItems: "center", gap: 6 },
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
});