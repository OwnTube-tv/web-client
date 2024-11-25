import { forwardRef, useState } from "react";
import { Typography } from "../../Typography";
import { IcoMoonIcon } from "../../IcoMoonIcon";
import { Pressable, PressableProps, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../../../theme";

interface TextLinkProps {
  isMobile: boolean;
  text: string;
}

export const TextLink = forwardRef<View, TextLinkProps & PressableProps>(
  ({ isMobile, onPress, text, ...restProps }, ref) => {
    const { colors } = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPress={onPress}
        style={styles.container}
        ref={ref}
        {...restProps}
      >
        <Typography
          fontSize={isMobile ? "sizeXS" : "sizeSm"}
          fontWeight="SemiBold"
          color={isHovered ? colors.white94 : colors.white80}
          style={{ textDecorationLine: isFocused ? "underline" : "none" }}
        >
          {text}
        </Typography>
        <IcoMoonIcon
          size={spacing.xl}
          color={isHovered ? colors.white94 : colors.white80}
          name="Chevron"
          style={styles.icon}
        />
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  container: { alignItems: "center", borderRadius: borderRadius.radiusMd, flexDirection: "row", gap: 8 },
  icon: { transform: [{ rotate: "-90deg" }] },
});

TextLink.displayName = "TextLink";
