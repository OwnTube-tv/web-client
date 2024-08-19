import { useViewHistory } from "../hooks";
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { Spacer } from "./shared/Spacer";
import { ViewHistoryListItem } from "./ViewHistoryListItem";
import { useTranslation } from "react-i18next";

export const ResumeWatching = () => {
  const { t } = useTranslation();
  const { viewHistory, isFetching, deleteVideoFromHistory } = useViewHistory();
  const latestVideo = viewHistory?.[0];

  if (!latestVideo || isFetching) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Spacer height={16} />
      <Typography>{t("continueWatching")}</Typography>
      <Spacer height={16} />
      <ViewHistoryListItem
        handleDeleteFromHistory={() => deleteVideoFromHistory(latestVideo?.uuid)}
        video={latestVideo}
      />
      <Spacer height={16} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, width: "100%" },
});
