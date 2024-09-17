import { ExternalLink } from "./ExternalLink";
import build_info from "../build-info.json";
import { Typography } from "./Typography";
import { removeSecondsFromISODate } from "../utils";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { borderRadius, spacing } from "../theme";

interface BuildInfoProps {
  alignCenter?: boolean;
}

export const BuildInfo = ({ alignCenter }: BuildInfoProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Typography
      style={{ textAlign: alignCenter ? "center" : undefined }}
      fontSize={"sizeXS"}
      color={colors.themeDesaturated500}
    >
      {t("revision")}{" "}
      <ExternalLink absoluteHref={build_info.COMMIT_URL}>
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
      </ExternalLink>
      {", "}
      {t("builtAtBy", { builtAt: removeSecondsFromISODate(build_info.BUILD_TIMESTAMP) })}{" "}
      <ExternalLink absoluteHref={"https://github.com/" + build_info.GITHUB_ACTOR}>
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
      </ExternalLink>
    </Typography>
  );
};

const styles = StyleSheet.create({
  externalLink: {
    borderRadius: borderRadius.radiusSm,
    paddingHorizontal: spacing.xs,
  },
});
