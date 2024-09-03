import { View, Image, StyleSheet } from "react-native";
import { Typography } from "../../../components";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../../../theme";
import { useBreakpoints } from "../../../hooks";

interface ChannelInfoHeaderProps {
  avatarUrl?: string;
  name?: string;
  description?: string;
}

export const ChannelInfoHeader = ({ avatarUrl, name, description }: ChannelInfoHeaderProps) => {
  const { colors } = useTheme();
  const { isMobile } = useBreakpoints();
  const avatarSize = isMobile ? 64 : 96;

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: isMobile ? spacing.sm : spacing.xl,
          gap: isMobile ? spacing.lg : spacing.xl,
        },
      ]}
    >
      {avatarUrl && (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: avatarSize, height: avatarSize, borderRadius: borderRadius.radiusMd }}
        />
      )}
      <View style={styles.textContainer}>
        <Typography fontSize={isMobile ? "sizeXL" : "sizeXXL"} fontWeight="ExtraBold" color={colors.theme900}>
          {name}
        </Typography>
        <Typography
          style={styles.descriptionContainer}
          fontSize="sizeMd"
          fontWeight="Medium"
          color={colors.themeDesaturated500}
          numberOfLines={4}
        >
          {description}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", paddingVertical: spacing.xl, width: "100%" },
  descriptionContainer: { flexShrink: 1, flexWrap: "wrap" },
  textContainer: { flex: 1, gap: spacing.md },
});
