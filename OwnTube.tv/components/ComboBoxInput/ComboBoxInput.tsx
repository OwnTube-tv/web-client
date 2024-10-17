import { Pressable, TextInput } from "react-native";
import { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import { ComboBoxInputProps } from "./models";
import { styles } from "./styles";
import { useFullScreenModalContext } from "../../contexts";
import { FullScreenSearchBox } from "./components";

const ComboBoxInput = ({
  onChange,
  data = [],
  testID,
  placeholder,
  width,
  allowCustomOptions,
  getCustomOptionText,
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
      style={[styles.container, { backgroundColor: colors.theme100, borderColor: colors.theme200, width }]}
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
        editable={false}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        style={[
          { color: colors.theme950, backgroundColor: colors.theme100, borderColor: colors.theme200 },
          styles.input,
        ]}
      />
    </Pressable>
  );
};

export default ComboBoxInput;
