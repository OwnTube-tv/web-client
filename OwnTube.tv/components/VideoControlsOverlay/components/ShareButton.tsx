import { forwardRef, useState } from "react";
import { IcoMoonIcon } from "../../IcoMoonIcon";
import { Typography } from "../../Typography";
import { Pressable, PressableProps, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../../../theme";
import { useTranslation } from "react-i18next";

interface ShareButtonProps extends PressableProps {
  isMobile: boolean;
}

export const ShareButton = forwardRef<View, ShareButtonProps>(({ onPress, isMobile, ...restProps }, ref) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      style={({ focused }) => [
        styles.container,
        { padding: spacing.md - (focused ? 2 : 0), borderWidth: focused ? 2 : 0, borderColor: colors.white94 },
      ]}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      ref={ref}
      {...restProps}
    >
      <IcoMoonIcon name={"Share"} size={spacing.xl} color={isHovered ? colors.white94 : colors.white80} />
      {!isMobile && (
        <Typography
          color={isHovered ? colors.white94 : colors.white80}
          fontSize="sizeSm"
          fontWeight="SemiBold"
          style={styles.text}
        >
          {t("share")}
        </Typography>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { alignContent: "center", borderRadius: borderRadius.radiusMd, flexDirection: "row", gap: spacing.md },
  text: { lineHeight: spacing.xl, userSelect: "none" },
});

ShareButton.displayName = "ShareButton";
