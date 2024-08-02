import { useState } from "react";
import { IcoMoonIcon } from "../../IcoMoonIcon";
import { Typography } from "../../Typography";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { spacing } from "../../../theme";
import { useTranslation } from "react-i18next";

interface ShareButtonProps {
  onPress: () => void;
  isMobile: boolean;
}

export const ShareButton = ({ onPress, isMobile }: ShareButtonProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
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
};

const styles = StyleSheet.create({
  container: { alignContent: "center", flexDirection: "row", gap: spacing.md, padding: spacing.md },
  text: { lineHeight: spacing.xl, userSelect: "none" },
});
