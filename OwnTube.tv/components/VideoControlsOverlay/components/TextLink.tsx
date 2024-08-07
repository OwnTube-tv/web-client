import { useState } from "react";
import { Typography } from "../../Typography";
import { IcoMoonIcon } from "../../IcoMoonIcon";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { spacing } from "../../../theme";

interface TextLinkProps {
  isMobile: boolean;
  onPress: () => void;
  text: string;
}

export const TextLink = ({ isMobile, onPress, text }: TextLinkProps) => {
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={styles.container}
    >
      <Typography
        fontSize={isMobile ? "sizeXS" : "sizeSm"}
        fontWeight="SemiBold"
        color={isHovered ? colors.white94 : colors.white80}
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
};

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", gap: 8 },
  icon: { transform: [{ rotate: "-90deg" }] },
});
