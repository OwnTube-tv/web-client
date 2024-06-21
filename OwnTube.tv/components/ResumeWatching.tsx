import { useViewHistory } from "../hooks";
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { Spacer } from "./shared/Spacer";
import { ViewHistoryListItem } from "./ViewHistoryListItem";

export const ResumeWatching = () => {
  const { viewHistory, isFetching } = useViewHistory();
  const latestVideo = viewHistory?.[0];

  if (!latestVideo || isFetching) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Spacer height={16} />
      <Typography>Continue where you left off:</Typography>
      <Spacer height={16} />
      <ViewHistoryListItem video={latestVideo} />
      <Spacer height={16} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, width: "100%" },
});
