import { Typography } from "./Typography";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";
import { useHoverState } from "../hooks";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { useTheme } from "@react-navigation/native";
import { ExternalLink } from "./ExternalLink";

interface ViewOnSiteLinkProps {
  site: string;
  url: string;
}

export const ViewOnSiteLink = ({ site, url }: ViewOnSiteLinkProps) => {
  const { t } = useTranslation();
  const { isHovered, toggleHovered } = useHoverState();
  const { colors } = useTheme();

  return (
    <ExternalLink asChild absoluteHref={url} target="_blank" rel="noopener noreferrer">
      <Pressable style={styles.container} onHoverIn={toggleHovered} onHoverOut={toggleHovered}>
        <Typography
          color={colors.white80}
          style={{ textDecorationLine: isHovered ? "underline" : "none" }}
          fontSize="sizeXS"
        >
          {t("viewOnSite", { site })}
        </Typography>
        <IcoMoonIcon color={colors.white80} name="External-Link" size={16} />
      </Pressable>
    </ExternalLink>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", gap: 4 },
});
