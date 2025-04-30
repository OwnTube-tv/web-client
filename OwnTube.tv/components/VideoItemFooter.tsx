import { formatDistanceToNow } from "date-fns";
import { LANGUAGE_OPTIONS } from "../i18n";
import { Typography } from "./Typography";
import { GetVideosVideo } from "../api/models";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";

export const VideoItemFooter = ({ video }: { video: GetVideosVideo }) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();

  return (
    <Typography fontSize="sizeXS" fontWeight="Medium" color={colors.themeDesaturated500}>
      {video.isLive
        ? `${video.state?.id !== 1 ? t("offline") : t("streamingNow")} • ${t("viewers", { count: video.viewers })}`
        : `${video.publishedAt ? formatDistanceToNow(video.publishedAt, { addSuffix: true, locale: LANGUAGE_OPTIONS.find(({ value }) => value === i18n.language)?.dateLocale }) : ""} • ${t("views", { count: video.views })}`}
    </Typography>
  );
};
