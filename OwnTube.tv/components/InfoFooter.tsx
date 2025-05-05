import { StyleSheet, View } from "react-native";
import { spacing } from "../theme";
import { Logo } from "./Svg";
import { useTheme } from "@react-navigation/native";
import { BuildInfo } from "./BuildInfo";
import { Typography } from "./Typography";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";

interface InfoFooterProps {
  showBuildInfo?: boolean;
}

export const InfoFooter = ({ showBuildInfo }: InfoFooterProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {process.env.EXPO_PUBLIC_FOOTER_LOGO ? (
        <Image
          resizeMode="contain"
          source={{ uri: process.env.EXPO_PUBLIC_FOOTER_LOGO }}
          style={{ width: 292, height: 73 }}
        />
      ) : (
        <Logo textColor={colors.theme950} width={73} height={32} />
      )}
      {showBuildInfo && (
        <View style={styles.buildInfoContainer}>
          {process.env.EXPO_PUBLIC_HIDE_GIT_DETAILS ? (
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Typography fontSize={"sizeXS"} color={colors.themeDesaturated500}>
                {t("build")}{" "}
              </Typography>
              <BuildInfo />
            </View>
          ) : (
            <BuildInfo alignCenter />
          )}
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
    position: undefined,
    width: "100%",
    zIndex: undefined,
  },
});
