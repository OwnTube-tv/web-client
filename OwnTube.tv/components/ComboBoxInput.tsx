import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Typography } from "./Typography";
import { useCallback, useMemo, useState } from "react";
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
}

const LIST_ITEM_HEIGHT = 40;

export const ComboBoxInput = ({ value = "", onChange, data = [], testID }: ComboBoxInputProps) => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);

  const onSelect = (item: { label: string; value: string }) => () => {
    onChange(item.value);
    setInputValue("");
    setIsDropDownVisible(false);
  };

  const filteredList = useMemo(() => {
    if (!inputValue) {
      return data;
    }

    return data.filter(({ label }) => label.toLowerCase().includes(inputValue.toLowerCase()));
  }, [data, inputValue]);

  const initialScrollIndex = useMemo(() => {
    if (value) {
      const scrollTo = filteredList?.findIndex(({ value: itemValue }) => itemValue === value) || 0;

      return scrollTo > 0 ? scrollTo : 0;
    }

    return 0;
  }, [filteredList, value]);

  const renderItem = useCallback(
    ({ item }: { item: DropDownItem }) => (
      <Pressable style={{ height: LIST_ITEM_HEIGHT }} onPress={onSelect(item)}>
        <Typography ellipsizeMode="tail" color={item.value === value ? colors.primary : undefined}>
          {item.label}
        </Typography>
      </Pressable>
    ),
    [value],
  );

  return (
    <View testID={testID} accessible={false}>
      <TextInput
        placeholder="Search..."
        placeholderTextColor={colors.card}
        style={[{ color: colors.primary, backgroundColor: colors.card }, styles.input]}
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
        <View style={[{ borderColor: colors.border }, styles.optionsContainer]}>
          <FlatList
            data={filteredList}
            renderItem={renderItem}
            extraData={filteredList?.length}
            initialScrollIndex={initialScrollIndex}
            keyExtractor={({ value }) => value}
            getItemLayout={(_, index) => ({
              length: LIST_ITEM_HEIGHT,
              offset: LIST_ITEM_HEIGHT * index,
              index,
            })}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 30,
    width: 300,
  },
  optionsContainer: {
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 400,
    padding: 8,
    position: "absolute",
    top: 30,
    width: 500,
    zIndex: 1,
  },
});
