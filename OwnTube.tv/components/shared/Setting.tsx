import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, Platform, View, StyleSheet } from "react-native";
import { useHoverState } from "../../hooks";
import { spacing } from "../../theme";
import { IcoMoonIcon } from "../IcoMoonIcon";
import { Typography } from "../Typography";
import { Spacer } from "./Spacer";

interface SettingProps {
  name: string;
  state?: string;
  onPress: () => void;
  isSubmenuAvailable?: boolean;
}

export const Setting = ({ name, state, onPress, isSubmenuAvailable = true }: SettingProps) => {
  const { colors } = useTheme();
  const { isHovered, toggleHovered } = useHoverState();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      onHoverOut={toggleHovered}
      onHoverIn={toggleHovered}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[
        styles.settingContainer,
        { backgroundColor: isHovered || (isFocused && Platform.isTV) ? colors.white10 : undefined },
      ]}
      onPress={onPress}
      hasTVPreferredFocus
    >
      <View style={styles.settingContent}>
        <Typography fontSize="sizeXS" color={colors.white94} fontWeight="SemiBold">
          {name}
        </Typography>
        <Typography fontSize="sizeXS" color={colors.white94} fontWeight="Regular">
          {state}
        </Typography>
      </View>
      {isSubmenuAvailable && (
        <>
          <Spacer width={spacing.xs} />
          <IcoMoonIcon name="Chevron-Right" size={24} color={colors.white94} />
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  settingContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  settingContent: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
});
