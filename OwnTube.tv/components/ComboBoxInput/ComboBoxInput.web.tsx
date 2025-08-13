import { FlatList, TextInput, View } from "react-native";
import { useCallback, useRef } from "react";
import { useTheme } from "@react-navigation/native";
import { ComboBoxInputProps, DropDownItem } from "./models";
import { styles } from "./styles";
import { useFilteredDropdown } from "./hooks";
import { DropdownItem, LIST_ITEM_HEIGHT } from "./components";

const ComboBoxInput = ({
  value = "",
  onChange,
  data = [],
  testID,
  placeholder,
  width,
  allowCustomOptions,
  getCustomOptionText,
  onChangeText,
}: ComboBoxInputProps) => {
  const { colors } = useTheme();
  const listRef = useRef<FlatList | null>(null);
  const { isOptionsVisible, onSelect, setIsOptionsVisible, inputValue, setInputValue, filteredList } =
    useFilteredDropdown({ value, data, onChange, allowCustomOptions, getCustomOptionText }, listRef);

  const renderItem = useCallback(
    ({ item }: { item: DropDownItem }) => <DropdownItem item={item} onSelect={onSelect} value={value} />,
    [value, onSelect],
  );

  const handleTextChange = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };

  return (
    <View
      testID={testID}
      accessible={false}
      style={[styles.container, { backgroundColor: colors.theme100, borderColor: colors.theme200, width }]}
    >
      <TextInput
        editable
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        style={[
          { color: colors.theme950, backgroundColor: colors.theme100, borderColor: colors.theme200 },
          styles.input,
        ]}
        onFocus={() => setIsOptionsVisible(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsOptionsVisible(false);
          }, 300);
        }}
        value={inputValue}
        onChangeText={handleTextChange}
        onSubmitEditing={(event) => {
          if (allowCustomOptions && event.nativeEvent.text && getCustomOptionText) {
            onSelect({ label: getCustomOptionText(event.nativeEvent.text), value: event.nativeEvent.text })();
          }
        }}
      />
      {isOptionsVisible && (
        <View
          style={[
            {
              borderColor: colors.theme200,
              backgroundColor: colors.theme100,
              width,
            },
            styles.optionsContainer,
          ]}
        >
          <FlatList
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
            style={styles.optionsList}
          />
        </View>
      )}
    </View>
  );
};

export default ComboBoxInput;
