import { Pressable, ViewStyle } from "react-native";
import { borderRadius } from "../theme";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { Input } from "./shared";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ForwardedRef, forwardRef } from "react";
import { TextInput } from "react-native-gesture-handler";

interface SearchInputProps {
  handleSubmit: () => void;
  style: ViewStyle;
  value: string;
  setValue: (text: string) => void;
  autoFocus: boolean;
}

export const SearchInput = forwardRef(
  ({ handleSubmit, style, value, setValue, autoFocus }: SearchInputProps, ref: ForwardedRef<TextInput | null>) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
      <Input
        ref={ref}
        autoFocus={autoFocus}
        trailingIcon={
          <Pressable
            onPress={handleSubmit}
            style={{
              backgroundColor: colors.theme500,
              borderRadius: borderRadius.radiusMd,
              justifyContent: "center",
              alignItems: "center",
              padding: 6,
            }}
          >
            <IcoMoonIcon name={"Search"} size={24} color={colors.theme50} />
          </Pressable>
        }
        style={style}
        value={value}
        placeholder={t("search")}
        placeholderTextColor={colors.themeDesaturated500}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        enterKeyHint="search"
      />
    );
  },
);

SearchInput.displayName = "SearchInput";
