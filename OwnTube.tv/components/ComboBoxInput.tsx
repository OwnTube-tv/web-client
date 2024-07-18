import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Typography } from "./Typography";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";

interface DropDownItem {
  label: string;
  value: string;
}

interface ComboBoxInputProps {
  value?: string;
  onChange: (value: string) => void;
  data?: Array<DropDownItem>;
  testID: string;
  searchable?: boolean;
  placeholder?: string;
}

const LIST_ITEM_HEIGHT = 50;

const DropdownItem = ({
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
      style={{
        justifyContent: "center",
        height: LIST_ITEM_HEIGHT,
        backgroundColor: colors[isHovered ? "card" : "background"],
      }}
      onPress={onSelect(item)}
    >
      <Typography color={item.value === value ? colors.primary : undefined}>{item.label}</Typography>
    </Pressable>
  );
};

export const ComboBoxInput = ({
  value = "",
  onChange,
  data = [],
  testID,
  searchable,
  placeholder,
}: ComboBoxInputProps) => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const listRef = useRef<FlatList | null>(null);

  const onSelect = (item: { label: string; value: string }) => () => {
    onChange(item.value);
    setInputValue("");
    setIsDropDownVisible(false);
  };

  const filteredList = useMemo(() => {
    if (!inputValue || !searchable) {
      return data;
    }

    return data.filter(({ label }) => label.toLowerCase().includes(inputValue.toLowerCase()));
  }, [data, inputValue, searchable]);

  useEffect(() => {
    if (value) {
      const idx = filteredList?.findIndex(({ value: itemValue }) => itemValue === value) || 0;

      listRef.current?.scrollToIndex({ index: idx || 0 });
    }
  }, [value]);

  const renderItem = useCallback(
    ({ item }: { item: DropDownItem }) => <DropdownItem item={item} onSelect={onSelect} value={value} />,
    [value, onSelect],
  );

  return (
    <View testID={testID} accessible={false} style={styles.container}>
      <TextInput
        editable={searchable}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        style={[{ color: colors.primary, backgroundColor: colors.card, borderColor: colors.primary }, styles.input]}
        onFocus={() => setIsDropDownVisible(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsDropDownVisible(false);
          }, 300);
        }}
        value={inputValue}
        onChangeText={setInputValue}
      />
      {isDropDownVisible && (
        <View
          style={[
            {
              borderColor: colors.border,
              backgroundColor: colors.background,
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
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: "relative", zIndex: 1 },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    height: 30,
    width: 300,
  },
  optionsContainer: {
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 400,
    left: 0,
    padding: 8,
    position: "absolute",
    top: 30,
    width: 500,
    zIndex: 99,
  },
});
