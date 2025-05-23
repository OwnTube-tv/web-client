import { spacing } from "../../../theme";
import { Button, Typography } from "../../../components";
import { Link, useLocalSearchParams } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useBreakpoints } from "../../../hooks";

interface SectionHeaderProps {
  title: string;
  link?: { route: string; text: string };
}

export const SectionHeader = ({ title, link }: SectionHeaderProps) => {
  const { colors } = useTheme();
  const { backend } = useLocalSearchParams();
  const { isMobile } = useBreakpoints();

  const isLinkVisible = !!link && !Platform.isTV;

  return (
    <View
      style={[
        {
          paddingTop: isMobile ? spacing.sm : spacing.xl,
          backgroundColor: colors.background,
          marginLeft: (!isMobile ? spacing.xl : 0) - Number(Boolean(Platform.isTV)) * 24,
          paddingLeft: (isMobile ? 10 : 0) + Number(Boolean(Platform.isTV)) * 24,
          paddingRight: Platform.select({
            default: (isMobile ? spacing.sm : 48) - Number(Boolean(Platform.isTV)) * 24,
            web: 48,
          }),
        },
        styles.container,
      ]}
    >
      <View
        style={[
          {
            borderLeftColor: colors.theme200,
          },
          styles.textContainer,
        ]}
      >
        <Typography style={styles.text} color={colors.theme950} fontSize="sizeXL" fontWeight="ExtraBold">
          {title}
        </Typography>
      </View>
      {isLinkVisible && (
        <Link asChild href={{ pathname: link.route, params: { backend } }}>
          <Button text={link.text} contrast="high" />
        </Link>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: spacing.sm,
    rowGap: spacing.md,
    width: "100%",
  },
  text: { lineHeight: 36 },
  textContainer: {
    borderLeftWidth: 4,
    paddingLeft: spacing.lg,
  },
});
