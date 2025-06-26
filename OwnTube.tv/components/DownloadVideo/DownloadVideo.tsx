import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import { spacing } from "../../theme";
import { ModalContainer } from "../ModalContainer";
import Picker from "../shared/Picker";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../Typography";
import { Spacer } from "../shared/Spacer";
import { Button } from "../shared";
import { useTranslation } from "react-i18next";
import { useFullScreenModalContext } from "../../contexts";
import useDownloadVideo from "../../hooks/useDownloadVideo";

const DownloadVideo = () => {
  const { dark: isDarkTheme } = useTheme();
  const { toggleModal } = useFullScreenModalContext();
  const { t } = useTranslation();
  const { handleDownloadFile, selectedFile, setSelectedFile, pickerOptions } = useDownloadVideo();

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={styles.modalWrapper} pointerEvents="box-none">
      <ModalContainer
        containerStyle={styles.modalContentContainer}
        onClose={() => toggleModal(false)}
        showCloseButton
        title={t("downloadVideo")}
      >
        <View>
          <Typography>{t("chooseQuality")}</Typography>
          <Spacer height={spacing.md} />
          <Picker
            value={selectedFile}
            darkTheme={isDarkTheme}
            placeholder={{}}
            onValueChange={setSelectedFile}
            items={pickerOptions}
          />
          <Spacer height={spacing.lg} />
          <Button onPress={handleDownloadFile} style={{ height: 48 }} text={t("download")} contrast="high" />
        </View>
      </ModalContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContentContainer: { justifyContent: "flex-end", width: 328 },
  modalWrapper: { alignItems: "center", flex: 1, justifyContent: "center" },
});

export default DownloadVideo;
