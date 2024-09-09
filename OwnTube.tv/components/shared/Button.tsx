import { PropsWithChildren, useMemo, forwardRef } from "react";
import { ViewStyle, Pressable, PressableProps, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useHoverState } from "../../hooks";
import { borderRadius } from "../../theme";
import { Typography } from "../Typography";
import { IcoMoonIcon } from "../IcoMoonIcon";

interface ButtonProps extends PropsWithChildren<PressableProps> {
  style?: ViewStyle;
  contrast?: "high" | "low" | "none";
  icon?: string;
  text?: string;
  justifyContent?: ViewStyle["justifyContent"];
  isActive?: boolean;
}

export const Button = forwardRef<View, ButtonProps>(
  ({ contrast = "none", text, icon, justifyContent = "center", isActive, ...props }, ref) => {
    const { colors } = useTheme();
    const { isHovered, toggleHovered } = useHoverState();

    const { regularColor, hoverColor } = useMemo(() => {
      return {
        none: { regularColor: colors.theme50, hoverColor: colors.theme100 },
        low: { regularColor: colors.theme100, hoverColor: colors.theme200 },
        high: { regularColor: colors.theme500, hoverColor: colors.theme600 },
      }[contrast];
    }, [colors, contrast]);

    return (
      <Pressable
        {...props}
        onHoverIn={(e) => {
          props.onHoverIn?.(e);
          toggleHovered();
        }}
        onHoverOut={(e) => {
          props.onHoverOut?.(e);
          toggleHovered();
        }}
        style={({ pressed }) => [
          styles.container,
          props.style,
          {
            backgroundColor: isHovered ? hoverColor : isActive || pressed ? colors.theme100 : regularColor,
            justifyContent,
          },
        ]}
        ref={ref}
      >
        {icon && <IcoMoonIcon name={icon} size={24} color={colors.theme900} />}
        {text && (
          <Typography
            fontSize="sizeSm"
            fontWeight="SemiBold"
            color={contrast === "high" ? colors.white94 : colors.theme900}
          >
            {text}
          </Typography>
        )}
      </Pressable>
    );
  },
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: borderRadius.radiusMd,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 9.5,
  },
});
