import { DropDownItem } from "../models";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Pressable, StyleSheet } from "react-native";
import { Typography } from "../../Typography";

export const LIST_ITEM_HEIGHT = 50;

export const DropdownItem = ({
  onSelect,
  item,
  value,
}: {
  onSelect: (item: DropDownItem) => () => void;
  item: DropDownItem;
  value: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { colors } = useTheme();

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ focused }) => [
        {
          backgroundColor: colors[isHovered || focused ? "theme200" : "theme100"],
        },
        styles.container,
      ]}
      onPress={onSelect(item)}
    >
      <Typography fontWeight="Medium" fontSize="sizeSm" color={item.value === value ? colors.primary : undefined}>
        {item.label}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: LIST_ITEM_HEIGHT,
    justifyContent: "center",
    padding: 16,
    zIndex: 1,
  },
});
