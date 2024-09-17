import { StyleSheet, View } from "react-native";
import { spacing } from "../theme";
import { Logo } from "./Svg";
import { useTheme } from "@react-navigation/native";
import { BuildInfo } from "./BuildInfo";

interface InfoFooterProps {
  showBuildInfo?: boolean;
}

export const InfoFooter = ({ showBuildInfo }: InfoFooterProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Logo textColor={colors.theme950} width={73} height={32} />
      {showBuildInfo && (
        <View style={styles.buildInfoContainer}>
          <BuildInfo alignCenter />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buildInfoContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.sm,
  },
  container: {
    alignItems: "center",
    gap: spacing.xl,
    justifyContent: "center",
    paddingBottom: spacing.xxl,
    paddingTop: spacing.xxxl,
    width: "100%",
  },
});
