import { useState } from "react";
import { Platform, StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Button } from "./Button";
import { borderRadius, spacing } from "../../theme";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../Typography";

interface InputProps extends TextInputProps {
  buttonText?: string;
  handleButtonPress?: () => void;
  variant?: "outlined" | "default";
  error?: string;
}

export const Input = ({ buttonText, handleButtonPress, variant = "outlined", error, ...props }: InputProps) => {
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
          props.onBlur?.(e);
        }}
        style={[
          {
            ...styles.input,
            borderColor: isFocused ? colors.theme500 : error ? colors.error500 : colors.theme200,
            backgroundColor: colors.theme100,
            borderWidth: isFocused || error ? 2 : variant === "default" ? 0 : 1,
            color: props.readOnly ? colors.themeDesaturated500 : colors.theme950,
            padding: (isFocused || error ? 14 : 16) - (Platform.isTVOS ? 16 : 0),
          },
          props.style,
        ]}
      />
      {buttonText && (
        <View style={styles.buttonContainer}>
          <Button text={buttonText} onPress={handleButtonPress} contrast="high" />
        </View>
      )}
      {error && (
        <Typography style={styles.errorText} fontSize="sizeXS" color={colors.error500}>
          {error}
        </Typography>
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
  errorText: {
    marginTop: spacing.sm,
  },
  input: {
    borderRadius: borderRadius.radiusMd,
    height: 48,
  },
});
