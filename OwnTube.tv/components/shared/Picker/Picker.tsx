import RNPickerSelect, { PickerSelectProps } from "react-native-picker-select";
import { borderRadius, fontSizes, fontWeights, spacing } from "../../../theme";
import { Platform, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { IcoMoonIcon } from "../../IcoMoonIcon";
import { useMemo, useState } from "react";

const Picker = (props: PickerSelectProps) => {
  const { colors } = useTheme();
  const containerStyle = useMemo(
    () => ({
      ...styles.container,
      backgroundColor: colors.theme100,
      borderColor: colors.theme200,
    }),
    [colors],
  );

  const textStyle = useMemo(
    () => ({
      fontSize: fontSizes.sizeSm,
      fontWeight: fontWeights.Medium,
      fontFamily: Platform.OS === "web" ? "Inter" : "Inter_500Medium",
      lineHeight: 17,
      color: colors.theme950,
    }),
    [colors],
  );

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <RNPickerSelect
      {...props}
      style={{
        inputWeb: { ...containerStyle, ...textStyle },
        placeholder: textStyle,
        inputIOSContainer: containerStyle,
        inputIOS: textStyle,
        inputAndroidContainer: containerStyle,
        inputAndroid: { ...textStyle, fontWeight: "500" },
        iconContainer: {
          pointerEvents: "none",
        },
        ...props.style,
      }}
      Icon={() => (
        <View style={[styles.chevronContainer, { transform: [{ rotate: isPickerOpen ? "180deg" : "0deg" }] }]}>
          <IcoMoonIcon name="Chevron" size={24} color={colors.theme500} />
        </View>
      )}
      useNativeAndroidPickerStyle={false}
      onOpen={() => setIsPickerOpen(true)}
      onClose={() => setIsPickerOpen(false)}
      pickerProps={{
        onFocus: () => setIsPickerOpen(true),
        onBlur: () => setIsPickerOpen(false),
      }}
    />
  );
};

const styles = StyleSheet.create({
  chevronContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  container: {
    alignItems: "center",
    borderRadius: borderRadius.radiusMd,
    borderWidth: 1,
    flexDirection: "row",
    height: 48,
    paddingLeft: spacing.lg,
  },
});

export default Picker;
