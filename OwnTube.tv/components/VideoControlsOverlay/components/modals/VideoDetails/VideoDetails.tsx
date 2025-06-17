import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";
import { ROUTES } from "../../../../../types";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useVideoLink } from "../../../../../hooks";
import { ModalContainer } from "../../../../ModalContainer";
import { Platform, ScrollView, View, StyleSheet } from "react-native";
import { ChannelLink } from "../../../../ChannelLink";
import { Typography } from "../../../../Typography";
import { format } from "date-fns";
import { Spacer } from "../../../../shared/Spacer";
import { FormattedVideoDescription } from "../../../../FormattedVideoDescription";
import { Button, Separator } from "../../../../shared";
import { spacing } from "../../../../../theme";
import * as Clipboard from "expo-clipboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VideoChannelSummary } from "@peertube/peertube-types";

interface VideoDetailsProps {
  onClose: () => void;
  name: string;
  channel?: VideoChannelSummary;
  datePublished: string | Date;
  description: string;
}

const VideoDetails = ({ onClose, name, channel, datePublished, description }: VideoDetailsProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [copyButtonText, setCopyButtonText] = useState(t("copyVideoDetails"));

  const timeoutRef = useRef<NodeJS.Timeout>();

  const link = useVideoLink({ isTimestampAdded: false });

  const handleCopyDetails = async () => {
    await Clipboard.setStringAsync(
      `Copied from ${link}

----

**Video name:** ${name}

**Channel name:** ${channel?.displayName}

**Published at:** ${datePublished}

**Description:**
${description}
`,
    );
    setCopyButtonText(t("detailsCopied"));
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopyButtonText(t("copyVideoDetails"));
    }, 3_000);
  };

  const safeAreaInsets = useSafeAreaInsets();

  return (
    <Animated.View entering={SlideInLeft} exiting={SlideOutLeft} style={styles.animatedContainer}>
      <ModalContainer
        showCloseButton
        onClose={onClose}
        title={name}
        containerStyle={{ ...styles.modalContainer, paddingLeft: safeAreaInsets.left || spacing.xl }}
      >
        <View style={styles.metadataContainer}>
          <ChannelLink
            text={channel?.displayName || ""}
            href={{ pathname: ROUTES.CHANNEL, params: { backend: channel?.host, channel: channel?.name } }}
            sourceLink={channel?.url || ""}
          />
          <Typography fontSize="sizeSm" fontWeight="SemiBold" color={colors.themeDesaturated500}>
            {format(datePublished, "dd MMMM yyyy")}
          </Typography>
        </View>
        <Spacer height={16} />
        <ScrollView>
          <FormattedVideoDescription>{description}</FormattedVideoDescription>
          {!Platform.isTV && (
            <>
              <Separator />
              <Spacer height={spacing.md} />
              <Button
                style={{ alignSelf: "flex-end" }}
                iconPosition="trailing"
                icon="Content-Copy"
                onPress={handleCopyDetails}
                text={copyButtonText}
              />
            </>
          )}
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
