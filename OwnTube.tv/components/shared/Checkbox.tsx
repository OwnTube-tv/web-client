import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../../theme";
import { useMemo } from "react";
import { Typography } from "../Typography";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}

export const Checkbox = ({ checked, onChange, disabled, label }: CheckboxProps) => {
  const { colors } = useTheme();

  const handleCheck = () => {
    onChange(!checked);
  };

  const colorConfig = useMemo(() => {
    return {
      border: disabled ? colors.theme100 : checked ? colors.theme500 : colors.theme200,
      background: checked ? colors.theme500 : colors.theme100,
      checkbox: disabled ? colors.themeDesaturated500 : colors.theme50,
      text: disabled ? colors.themeDesaturated500 : colors.theme950,
    };
  }, [disabled, checked]);

  return (
    <Pressable
      onPress={handleCheck}
      style={({ focused }) => ({
        padding: focused ? 0 : -2,
        margin: focused ? 0 : 2,
        borderWidth: focused ? 2 : 0,
        borderColor: colors.theme950,
        ...styles.focusableContainer,
      })}
    >
      <View
        style={[
          styles.checkboxContainer,
          {
            backgroundColor: colorConfig.background,
            borderColor: colorConfig.border,
          },
        ]}
      >
        {checked && (
          <Svg width={12} height={9} fill="none">
            <Path fill={colorConfig.checkbox} d="m0 4.8 1.2-1.2 3 3L10.8 0 12 1.2 4.2 9 0 4.8Z" />
          </Svg>
        )}
      </View>
      <Typography fontSize="sizeSm" fontWeight="Medium" color={colorConfig.text}>
        {label}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    alignItems: "center",
    borderRadius: borderRadius.radiusSm,
    borderWidth: 1,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  focusableContainer: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: borderRadius.radiusSm,
    flexDirection: "row",
    gap: spacing.md,
  },
});
