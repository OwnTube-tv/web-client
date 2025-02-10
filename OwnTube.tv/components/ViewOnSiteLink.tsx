import { Typography } from "./Typography";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet } from "react-native";
import { useHoverState } from "../hooks";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { useTheme } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";

interface ViewOnSiteLinkProps {
  site: string;
  url: string;
}

export const ViewOnSiteLink = ({ site, url }: ViewOnSiteLinkProps) => {
  const { t } = useTranslation();
  const { isHovered, toggleHovered } = useHoverState();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <Pressable
        onPress={Platform.OS === "web" ? null : () => router.navigate(url)}
        style={styles.container}
        onHoverIn={toggleHovered}
        onHoverOut={toggleHovered}
      >
        <Typography
          color={colors.white80}
          style={{ textDecorationLine: isHovered ? "underline" : "none" }}
          fontSize="sizeXS"
        >
          {t("viewOnSite", { site })}
        </Typography>
        <IcoMoonIcon color={colors.white80} name="External-Link" size={16} />
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", gap: 4 },
});
