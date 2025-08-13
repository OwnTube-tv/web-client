import { Platform, Pressable, TextInput } from "react-native";
import { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { ComboBoxInputProps } from "./models";
import { styles } from "./styles";
import { useFullScreenModalContext } from "../../contexts";
import { FullScreenSearchBox } from "./components";
import { spacing } from "../../theme";

const ComboBoxInput = ({
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
  const modalControls = useFullScreenModalContext();

  const modalContent = useMemo(() => {
    return (
      <FullScreenSearchBox
        onChange={onChange}
        data={data}
        placeholder={placeholder}
        handleClose={() => modalControls.toggleModal(false)}
        allowCustomOptions={allowCustomOptions}
        getCustomOptionText={getCustomOptionText}
      />
    );
  }, [onChange, data, placeholder, modalControls, getCustomOptionText]);

  return (
    <Pressable
      testID={testID}
      style={({ focused }) => [
        styles.container,
        { backgroundColor: colors.theme100, borderColor: focused ? colors.theme950 : colors.theme200, width },
      ]}
      onPress={() => {
        modalControls.toggleModal(true);
        modalControls.setContent(modalContent);
      }}
    >
      <TextInput
        onPress={() => {
          modalControls.toggleModal(true);
          modalControls.setContent(modalContent);
        }}
        onChangeText={onChangeText}
        editable={false}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        style={[
          styles.input,
          {
            color: colors.theme950,
            backgroundColor: colors.theme100,
            borderColor: colors.theme200,
            paddingLeft: Platform.isTV && Platform.OS === "ios" ? 0 : Platform.OS === "web" ? spacing.lg : spacing.lg,
          },
        ]}
      />
    </Pressable>
  );
};

export default ComboBoxInput;
