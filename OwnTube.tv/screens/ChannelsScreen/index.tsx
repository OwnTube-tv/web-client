import { useGetChannelsQuery } from "../../api";
import { Screen } from "../../layouts";
import { spacing } from "../../theme";
import { ChannelView } from "../../components";
import { useBreakpoints } from "../../hooks";
import { StyleSheet } from "react-native";

export const ChannelsScreen = () => {
  const { data: channels } = useGetChannelsQuery();
  const { isMobile } = useBreakpoints();

  return (
    <Screen
      style={{
        ...styles.screenContainer,
        paddingRight: isMobile ? 0 : spacing.xl,
      }}
    >
      {channels?.map((channel) => <ChannelView key={channel.id} channel={channel} />)}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center",
    flex: 1,
    gap: spacing.xl,
    justifyContent: "center",
    padding: 0,
    paddingTop: spacing.xl,
  },
});
