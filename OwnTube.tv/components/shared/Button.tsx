import { PropsWithChildren, useMemo, forwardRef, useCallback } from "react";
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
  ({ contrast = "none", text, icon, justifyContent = "center", isActive, disabled, ...props }, ref) => {
    const { colors } = useTheme();
    const { isHovered, toggleHovered } = useHoverState();

    const { regularColor, hoverColor } = useMemo(() => {
      return {
        none: { regularColor: colors.theme50, hoverColor: colors.theme100 },
        low: { regularColor: colors.theme100, hoverColor: colors.theme200 },
        high: { regularColor: colors.theme500, hoverColor: colors.theme600 },
      }[contrast];
    }, [colors, contrast]);

    const getBackgroundColor = useCallback(
      (pressed: boolean) => {
        if (disabled) {
          return colors.theme100;
        }

        return isHovered ? hoverColor : isActive || pressed ? colors.theme100 : regularColor;
      },
      [colors, isHovered, hoverColor, isActive, regularColor, disabled],
    );

    const textColor = disabled ? colors.themeDesaturated500 : contrast === "high" ? colors.white94 : colors.theme900;

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
        style={({ pressed, focused }) => [
          styles.container,
          props.style,
          {
            backgroundColor: getBackgroundColor(pressed),
            justifyContent,
            borderWidth: focused ? 2 : 0,
            borderColor: colors.theme950,
            paddingHorizontal:
              (Number(props.style?.paddingHorizontal) || styles.container.paddingHorizontal || 0) - (focused ? 2 : 0),
            paddingVertical:
              (Number(props.style?.paddingVertical) || styles.container.paddingVertical || 0) - (focused ? 2 : 0),
          },
        ]}
        ref={ref}
      >
        {icon && <IcoMoonIcon name={icon} size={24} color={contrast === "high" ? colors.white94 : colors.theme900} />}
        {text && (
          <Typography fontSize="sizeSm" fontWeight="SemiBold" color={textColor}>
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
