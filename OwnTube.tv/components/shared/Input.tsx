import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Button } from "./Button";
import { borderRadius } from "../../theme";
import { useTheme } from "@react-navigation/native";

interface InputProps extends TextInputProps {
  buttonText?: string;
  handleButtonPress?: () => void;
}

export const Input = ({ buttonText, handleButtonPress, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();

  return (
    <View accessible={false}>
      <TextInput
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onFocus?.(e);
        }}
        style={[
          {
            ...styles.input,
            borderColor: isFocused ? colors.theme500 : colors.theme200,
            backgroundColor: colors.theme100,
            borderWidth: isFocused ? 2 : 1,
            color: props.readOnly ? colors.themeDesaturated500 : colors.theme950,
            padding: isFocused ? 15 : 16,
          },
          props.style,
        ]}
      />
      {buttonText && (
        <View style={styles.buttonContainer}>
          <Button text={buttonText} onPress={handleButtonPress} contrast="high" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    bottom: 6,
    position: "absolute",
    right: 6,
    top: 6,
  },
  input: {
    borderRadius: borderRadius.radiusMd,
    height: 48,
  },
});
