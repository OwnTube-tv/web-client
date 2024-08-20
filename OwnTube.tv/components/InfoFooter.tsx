import { StyleSheet, View } from "react-native";
import { spacing } from "../theme";
import { Logo } from "./Svg";
import { useTheme } from "@react-navigation/native";
import { Typography } from "./Typography";

export const InfoFooter = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Logo textColor={colors.theme950} width={73} height={32} />
      <Typography color={colors.themeDesaturated500} fontSize="sizeXS" fontWeight="Medium">
        Copyright etc.
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.xl,
    justifyContent: "center",
    paddingBottom: spacing.xxl,
    paddingTop: spacing.xxxl,
    width: "100%",
  },
});
