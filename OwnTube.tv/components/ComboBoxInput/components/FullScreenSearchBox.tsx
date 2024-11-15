import { FC, useCallback, useRef, useState } from "react";
import { Button } from "../../shared";
import { FlatList, Platform, StyleSheet, TextInput, TVFocusGuideView, View } from "react-native";
import { styles } from "../styles";
import { DropdownItem, LIST_ITEM_HEIGHT } from "./DropdownItem";
import { borderRadius, spacing } from "../../../theme";
import { DropDownItem } from "../models";
import { useFilteredDropdown } from "../hooks";
import { useTheme } from "@react-navigation/native";
import { TvKeyboard } from "../../TvKeyboard";
import { Spacer } from "../../shared/Spacer";

interface FullScreenSearchBoxProps {
  handleClose: () => void;
  placeholder?: string;
  data?: DropDownItem[];
  onChange: (newValue: string) => void;
  allowCustomOptions?: boolean;
  getCustomOptionText?: (input: string) => string;
}

export const FullScreenSearchBox: FC<FullScreenSearchBoxProps> = ({
  handleClose,
  placeholder,
  data,
  onChange,
  allowCustomOptions,
  getCustomOptionText,
}) => {
  const { colors } = useTheme();
  const listRef = useRef<FlatList | null>(null);
  const [closeButtonRef, setCloseButtonRef] = useState<View | null>(null);
  const [inputRef, setInputRef] = useState<TextInput | null>(null);

  const { inputValue, setInputValue, filteredList } = useFilteredDropdown(
    { data, onChange, allowCustomOptions, getCustomOptionText },
    listRef,
  );

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
    <TVFocusGuideView trapFocusUp trapFocusLeft trapFocusRight trapFocusDown style={{ flex: 1, marginTop: 0 }}>
      <View style={componentStyles.inputHeaderContainer}>
        <TextInput
          editable={!Platform.isTV}
          autoFocus={!Platform.isTV}
          placeholder={placeholder}
          placeholderTextColor={colors.text}
          style={[
            styles.input,
            {
              color: colors.theme950,
              backgroundColor: colors.theme100,
              borderColor: colors.theme200,
              height: 48,
              paddingLeft: Platform.isTV && Platform.OS === "ios" ? 0 : spacing.lg,
              flex: 1,
            },
          ]}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={(event) => {
            if (allowCustomOptions && event.nativeEvent.text) {
              onChange(event.nativeEvent.text);
              handleClose();
            }
          }}
          ref={(node) => setInputRef(node)}
        />
        <Button
          hasTVPreferredFocus
          ref={(node) => setCloseButtonRef(node)}
          onPress={handleClose}
          icon="Close"
          style={componentStyles.closeBtn}
          // @ts-expect-error ref typings broken in react-native-tvos
          nextFocusLeft={inputRef?.current}
        />
      </View>
      {Platform.isTV ? (
        <View style={componentStyles.tvKeyboardWrapper}>
          <TvKeyboard
            onBackspace={() =>
              setInputValue((prev) => {
                if (prev.length > 0) {
                  return prev.slice(0, -1);
                }

                return prev;
              })
            }
            onKeyPress={(key: string) => setInputValue((prev) => prev + key)}
            // @ts-expect-error ref typings broken in react-native-tvos
            nextFocusUp={closeButtonRef}
          />
        </View>
      ) : (
        <Spacer height={spacing.xs} />
      )}
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
          style={{ ...componentStyles.list, flex: Platform.isTV ? 0 : 1 }}
        />
      </View>
    </TVFocusGuideView>
  );
};

const componentStyles = StyleSheet.create({
  closeBtn: { height: 48 },
  inputHeaderContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    minWidth: "100%",
  },
  list: {
    borderRadius: borderRadius.radiusMd,
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
  optionsContainer: {
    borderRadius: borderRadius.radiusMd,
    height: "100%",
    maxHeight: null,
    overflow: "hidden",
    position: "relative",
    top: 0,
    width: "100%",
  },
  tvKeyboardWrapper: { alignItems: "center", marginVertical: spacing.sm },
});
