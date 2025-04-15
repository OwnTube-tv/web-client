import build_info from "../build-info.json";
import { Typography } from "./Typography";
import { removeSecondsFromISODate } from "../utils";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { borderRadius, spacing } from "../theme";
import { Link } from "expo-router";

interface BuildInfoProps {
  alignCenter?: boolean;
}

export const BuildInfo = ({ alignCenter }: BuildInfoProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  if (process.env.EXPO_PUBLIC_HIDE_GIT_DETAILS) {
    return (
      <Typography
        style={{ textAlign: alignCenter ? "center" : undefined }}
        fontSize={"sizeXS"}
        color={colors.themeDesaturated500}
      >
        {removeSecondsFromISODate(build_info.BUILD_TIMESTAMP)}
      </Typography>
    );
  }

  return (
    <Typography
      style={{ textAlign: alignCenter ? "center" : undefined }}
      fontSize={"sizeXS"}
      color={colors.themeDesaturated500}
    >
      {t("revision")}{" "}
      <Link target="_blank" rel="noopener noreferrer" href={build_info.COMMIT_URL}>
        <Typography
          style={[
            styles.externalLink,
            {
              backgroundColor: colors.theme200,
            },
          ]}
          fontSize={"sizeXS"}
          color={colors.white94}
        >
          {build_info.GITHUB_SHA_SHORT}
        </Typography>
      </Link>
      {",\n"}
      {t("builtAtBy", { builtAt: removeSecondsFromISODate(build_info.BUILD_TIMESTAMP) })}{" "}
      <Link target="_blank" rel="noopener noreferrer" href={"https://github.com/" + build_info.GITHUB_ACTOR}>
        <Typography
          style={[
            styles.externalLink,
            {
              backgroundColor: colors.theme200,
            },
          ]}
          fontSize={"sizeXS"}
          color={colors.white94}
        >
          {build_info.GITHUB_ACTOR}
        </Typography>
      </Link>
    </Typography>
  );
};

const styles = StyleSheet.create({
  externalLink: {
    borderRadius: borderRadius.radiusSm,
    paddingHorizontal: spacing.xs,
  },
});
