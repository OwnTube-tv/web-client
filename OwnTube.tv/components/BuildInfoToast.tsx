import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import build_info from "../build-info.json";
import { useTheme } from "@react-navigation/native";
import { removeSecondsFromISODate } from "../utils";
import { ExternalLink } from "./ExternalLink";
import { useTranslation } from "react-i18next";

export const BuildInfoToast = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[{ backgroundColor: colors.card }, styles.container]}>
      <Typography fontSize={14} style={{ userSelect: "none" }}>
        {t("revision")}{" "}
        <ExternalLink absoluteHref={build_info.COMMIT_URL}>
          <Typography fontSize={14} style={styles.link}>
            {build_info.GITHUB_SHA_SHORT}
          </Typography>{" "}
        </ExternalLink>
        {t("builtAtBy", { builtAt: removeSecondsFromISODate(build_info.BUILD_TIMESTAMP) })}{" "}
        <ExternalLink absoluteHref={"https://github.com/" + build_info.GITHUB_ACTOR}>
          <Typography fontSize={14} style={styles.link}>
            {build_info.GITHUB_ACTOR}
          </Typography>
        </ExternalLink>
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
  },
  link: {
    textDecorationLine: "underline",
  },
});
