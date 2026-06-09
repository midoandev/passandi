
import { BottomSheet, Column, Icon, List, Button, Row, Spacer, Text, } from "@expo/ui";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/config/ThemeContext";
import { colors } from "@/shared/config/ThemeContext";
import {
  paddingAll,
  fillMaxWidth,
  background,
  border,
  shadow,
  clickable,
} from '@expo/ui/jetpack-compose/modifiers';

type Option = { label: string; value: string };

type Props = {
  visible: boolean;
  title: string;
  options: Option[];
  selected: string;
  onSelect: (val: string) => void;
  onClose: () => void;
};

const ITEM_HEIGHT = 60;
const HEADER_HEIGHT = 40;

export function OptionPickerModal({
  visible, title, options, selected, onSelect, onClose,
}: Props) {
  const { tokens } = useTheme();

  const contentHeight = options.length * ITEM_HEIGHT + HEADER_HEIGHT + 24;

  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onClose}
      modifiers={[background(tokens.bg)]}
    >
      <Column alignment="center">
        <Text
          textStyle={{
            fontWeight: "700",
            fontSize: 18,
            textAlign: "center",
            color: tokens.text,
            lineHeight: 24,
          }}
          style={{ paddingVertical: 24 }}
        >
          {title}
        </Text>
        <Column spacing={8} style={{ width: '100%' }}>
          {options.map((opt) => {
            const isSelected = selected === opt.value;

            return (
              <Button
                key={opt.value}
                onPress={() => {
                  onSelect(opt.value);
                  onClose();
                }}
                // modifiers={[fillMaxWidth(), paddingAll]}
                variant="text"
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  backgroundColor: isSelected ? colors.brand.blue + "11" : '#00000000',
                  borderWidth: 0.5,
                  borderColor: tokens.border,
                  borderRadius: 10,
                }}
              >
                <Row key={opt.value} >
                  <Text
                    textStyle={{
                      color: isSelected ? colors.brand.blue : tokens.text,
                      fontWeight: isSelected ? "500" : "400",
                      fontSize: 15
                    }}
                  >
                    {opt.label}
                  </Text>
                  <Spacer flexible />
                  {isSelected ? (
                    <Icon
                      name="checkmark.circle"
                      size={20}
                      color={colors.brand.blue}
                    />
                  ) : null}
                </Row></Button>
            );
          })}
        </Column>
      </Column>
    </BottomSheet>
  );
}