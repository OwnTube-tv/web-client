import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { ScrollView, StyleSheet, View } from "react-native";
import { format } from "date-fns";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../../../../app/_layout";
import { ROUTES } from "../../../../../types";
import { ModalContainer } from "../../../../ModalContainer";
import { ChannelLink } from "../../../../ChannelLink";
import { Typography } from "../../../../Typography";
import { Spacer } from "../../../../shared/Spacer";
import { FormattedVideoDescription } from "../../../../FormattedVideoDescription";
import { VideoChannel } from "@peertube/peertube-types";

interface VideoDetailsProps {
  onClose: () => void;
  name: string;
  channel?: VideoChannel;
  datePublished: string | Date;
  description: string;
}

const VideoDetails = ({ onClose, name, channel, datePublished, description }: VideoDetailsProps) => {
  const { colors } = useTheme();
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();

  return (
    <Animated.View entering={SlideInLeft} exiting={SlideOutLeft} style={styles.animatedContainer}>
      <ModalContainer showCloseButton onClose={onClose} title={name} containerStyle={styles.modalContainer}>
        <View style={styles.metadataContainer}>
          <ChannelLink
            text={channel?.displayName || ""}
            href={{ pathname: ROUTES.CHANNEL, params: { backend, channel: channel?.name } }}
            sourceLink={channel?.url || ""}
          />
          <Typography fontSize="sizeSm" fontWeight="SemiBold" color={colors.themeDesaturated500}>
            {format(datePublished, "dd MMMM yyyy")}
          </Typography>
        </View>
        <Spacer height={16} />
        <ScrollView>
          <FormattedVideoDescription>{description}</FormattedVideoDescription>
        </ScrollView>
      </ModalContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: { flex: 1, maxWidth: 530, width: "100%" },
  metadataContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    height: "100%",
    width: "100%",
  },
});

export default VideoDetails;
