import { MutableRefObject, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { ComboBoxInputProps } from "../models";

export const useFilteredDropdown = (
  { data, value, onChange }: Pick<ComboBoxInputProps, "data" | "value" | "onChange"> & { value?: string },
  listRef: MutableRefObject<FlatList | null>,
) => {
  const [inputValue, setInputValue] = useState("");
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const onSelect = (item: { label: string; value: string }) => () => {
    onChange(item.value);
    setInputValue("");
    setIsOptionsVisible(false);
  };

  const filteredList = useMemo(() => {
    if (!inputValue) {
      return data;
    }

    return data?.filter(({ label }) => label.toLowerCase().includes(inputValue.toLowerCase()));
  }, [data, inputValue]);

  useEffect(() => {
    if (value) {
      const idx = filteredList?.findIndex(({ value: itemValue }) => itemValue === value) || 0;

      listRef.current?.scrollToIndex({ index: idx || 0 });
    }
  }, [value]);

  return { onSelect, isOptionsVisible, setIsOptionsVisible, inputValue, setInputValue, filteredList };
};
