import { useViewHistory, ViewHistoryEntry } from "../hooks";
import { FlatList, StyleSheet, View } from "react-native";
import { Loader } from "./Loader";
import { Spacer } from "./shared/Spacer";
import { Typography } from "./Typography";
import { ViewHistoryListItem } from "./ViewHistoryListItem";
import { useTranslation } from "react-i18next";
import { IconButton } from "./IconButton";
import { useCallback } from "react";

export const ViewHistory = () => {
  const { t } = useTranslation();
  const { viewHistory, clearHistory, isFetching, deleteVideoFromHistory } = useViewHistory();

  const renderItem = useCallback(
    ({ item }: { item: ViewHistoryEntry }) => (
      <ViewHistoryListItem handleDeleteFromHistory={() => deleteVideoFromHistory(item.uuid)} video={item} />
    ),
    [deleteVideoFromHistory],
  );

  if (!viewHistory?.length && !isFetching) {
    return <Typography>{t("viewHistoryEmpty")}</Typography>;
  }

  if (isFetching) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Typography style={styles.header}>{t("viewHistory")}</Typography>
        <IconButton icon="Trash" onPress={clearHistory} text={t("clear")} />
      </View>
      <FlatList renderItem={renderItem} data={viewHistory} ItemSeparatorComponent={() => <Spacer height={32} />} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16, width: "100%" },
  header: { marginBottom: 16 },
  headerContainer: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
});
