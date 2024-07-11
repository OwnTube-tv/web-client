import { useViewHistory } from "../hooks";
import { FlatList, StyleSheet, View } from "react-native";
import { Loader } from "./Loader";
import { Spacer } from "./shared/Spacer";
import { Typography } from "./Typography";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { ViewHistoryListItem } from "./ViewHistoryListItem";
import { useTranslation } from "react-i18next";

export const ViewHistory = () => {
  const { t } = useTranslation();
  const { viewHistory, clearHistory, isFetching } = useViewHistory();
  const theme = useTheme();

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
        <Ionicons.Button
          name="trash"
          backgroundColor={theme.colors.background}
          style={{ ...styles.iconButton, borderColor: theme.colors.border }}
          onPress={() => clearHistory()}
        >
          <Typography>{t("clear")}</Typography>
        </Ionicons.Button>
      </View>
      <FlatList
        renderItem={({ item }) => <ViewHistoryListItem video={item} />}
        data={viewHistory}
        ItemSeparatorComponent={() => <Spacer height={32} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16, width: "100%" },
  header: { marginBottom: 16 },
  headerContainer: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  iconButton: { borderWidth: 1 },
});
