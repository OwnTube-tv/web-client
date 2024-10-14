import { FC, useCallback, useRef } from "react";
import { Button } from "../../shared";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { styles } from "../styles";
import { DropdownItem, LIST_ITEM_HEIGHT } from "./DropdownItem";
import { borderRadius } from "../../../theme";
import { DropDownItem } from "../models";
import { useFilteredDropdown } from "../hooks";
import { useTheme } from "@react-navigation/native";

interface FullScreenSearchBoxProps {
  handleClose: () => void;
  placeholder?: string;
  data?: DropDownItem[];
  onChange: (newValue: string) => void;
}

export const FullScreenSearchBox: FC<FullScreenSearchBoxProps> = ({ handleClose, placeholder, data, onChange }) => {
  const { colors } = useTheme();
  const listRef = useRef<FlatList | null>(null);

  const { inputValue, setInputValue, filteredList } = useFilteredDropdown({ data, onChange }, listRef);

  const renderItem = useCallback(
    ({ item }: { item: DropDownItem }) => (
      <DropdownItem
        item={item}
        onSelect={(item) => () => {
          onChange(item.value);
          handleClose();
        }}
        value={inputValue}
      />
    ),
    [inputValue, onChange, handleClose, onChange],
  );

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={handleClose} icon="Close" style={componentStyles.closeBtn} />
      <TextInput
        autoFocus
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        style={[
          styles.input,
          { color: colors.theme950, backgroundColor: colors.theme100, borderColor: colors.theme200, height: 48 },
        ]}
        value={inputValue}
        onChangeText={setInputValue}
      />
      <View
        style={[
          styles.optionsContainer,
          {
            borderColor: colors.theme200,
            backgroundColor: colors.theme100,
          },
          componentStyles.optionsContainer,
        ]}
      >
        <FlatList
          keyboardShouldPersistTaps="always"
          bounces={false}
          ref={listRef}
          data={filteredList}
          renderItem={renderItem}
          extraData={filteredList?.length}
          keyExtractor={({ value }) => value}
          getItemLayout={(_, index) => ({
            length: LIST_ITEM_HEIGHT,
            offset: LIST_ITEM_HEIGHT * index,
            index,
          })}
          maxToRenderPerBatch={50}
          style={componentStyles.list}
        />
      </View>
    </View>
  );
};

const componentStyles = StyleSheet.create({
  closeBtn: { height: 48, position: "absolute", right: 0, top: 0, zIndex: 2 },
  list: {
    borderRadius: borderRadius.radiusMd,
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
  optionsContainer: { height: "100%", maxHeight: null, width: "100%" },
});
