
import { BottomSheet } from "@expo/ui";
import {
  align,
  background, width
} from '@expo/ui/jetpack-compose/modifiers';
import {
  OutlinedButton, Column, Icon, Button, Row, Spacer, Text,
} from '@expo/ui/jetpack-compose';
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
      modifiers={[
        background(tokens.bg),
      ]}>
      <Column modifiers={[align("center")]}>
        <Text

        // style={{ paddingVertical: 24 }}
        >
          {title}
        </Text>
        <Column >
          {options.map((opt) => {
            const isSelected = selected === opt.value;

            return (
              <OutlinedButton onClick={() => { }}>
                <Text>Send</Text>
                <Spacer modifiers={[width(8)]} />
                <Text>waw</Text>
              </OutlinedButton>
              // <Button
              //   key={opt.value}
              //   onPress={() => {
              //     onSelect(opt.value);
              //     onClose();
              //   }}
              //   variant="text"
              //   style={{
              //     width: '100%',
              //     paddingVertical: 16,
              //     paddingHorizontal: 16,
              //     backgroundColor: isSelected ? colors.brand.blue + "11" : '#00000000',
              //     borderWidth: 0.5,
              //     borderColor: tokens.border,
              //     borderRadius: 10,
              //   }}
              // >
              //   <Row key={opt.value} >
              //     <Text
              //       textStyle={{
              //         color: isSelected ? colors.brand.blue : tokens.text,
              //         fontWeight: isSelected ? "500" : "400",
              //         fontSize: 15
              //       }}
              //     >
              //       {opt.label}
              //     </Text>
              //     <Spacer flexible />
              //     {isSelected ? (
              //       <Icon
              //         name="checkmark.circle"
              //         size={20}
              //         color={colors.brand.blue}
              //       />
              //     ) : null}
              //   </Row></Button>
            );
          })}
        </Column>
      </Column>
    </BottomSheet>
  );
}