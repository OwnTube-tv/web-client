import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { ModalContainer } from "../../../ModalContainer";
import { ScrollView, StyleSheet, View } from "react-native";
import { ChannelLink } from "../../../ChannelLink";
import { Typography } from "../../../Typography";
import { format } from "date-fns";
import { Spacer } from "../../../shared/Spacer";
import { useTheme } from "@react-navigation/native";

interface VideoDetailsProps {
  onClose: () => void;
  name: string;
  channelName: string;
  datePublished: string | Date;
  description: string;
}

export const VideoDetails = ({ onClose, name, channelName, datePublished, description }: VideoDetailsProps) => {
  const { colors } = useTheme();

  return (
    <Animated.View entering={SlideInLeft} exiting={SlideOutLeft} style={styles.animatedContainer}>
      <ModalContainer onClose={onClose} title={name} containerStyle={styles.modalContainer}>
        <View style={styles.metadataContainer}>
          <ChannelLink text={channelName} href="#" />
          <Typography fontSize="sizeSm" fontWeight="SemiBold" color={colors.themeDesaturated500}>
            {format(datePublished, "dd MMMM yyyy")}
          </Typography>
        </View>
        <Spacer height={16} />
        <ScrollView>
          <Typography fontSize="sizeSm" fontWeight="Regular">
            {description}
          </Typography>
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
