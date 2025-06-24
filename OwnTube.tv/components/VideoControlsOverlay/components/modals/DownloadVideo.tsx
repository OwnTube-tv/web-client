import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { Platform, StyleSheet, View } from "react-native";
import { spacing } from "../../../../theme";
import { ModalContainer } from "../../../ModalContainer";
import { useFullScreenModalContext } from "../../../../contexts";
import { useTranslation } from "react-i18next";
import { useGlobalSearchParams } from "expo-router";
import { useGetVideoQuery } from "../../../../api";
import { RootStackParams } from "../../../../app/_layout";
import { ROUTES } from "../../../../types";
import Picker from "../../../shared/Picker";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Typography } from "../../../Typography";
import { Spacer } from "../../../shared/Spacer";
import { Button } from "../../../shared";
import { formatFileSize, sanitizeFileName } from "../../../../utils";
import { File, Paths, Directory } from "expo-file-system/next";
import Toast from "react-native-toast-message";
import * as MediaLibrary from "expo-media-library";

export const DownloadVideo = () => {
  const { toggleModal } = useFullScreenModalContext();
  const { t } = useTranslation();
  const params = useGlobalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const [selectedFile, setSelectedFile] = useState<string>();
  const { dark: isDarkTheme } = useTheme();

  const { data: videoData } = useGetVideoQuery({ id: params?.id });

  const pickerOptions = useMemo(() => {
    if (videoData?.files && Number(videoData?.files?.length) > 0) {
      return videoData.files.map((file) => ({
        label: `${file.resolution.label} (${formatFileSize(file.size)})`,
        value: file.fileDownloadUrl,
      }));
    }

    if (videoData?.streamingPlaylists && Number(videoData?.streamingPlaylists?.length) > 0) {
      return videoData.streamingPlaylists[0].files.map((file) => ({
        label: `${file.resolution.label} (${formatFileSize(file.size)})`,
        value: file.fileDownloadUrl,
      }));
    }

    return [];
  }, [videoData]);

  useEffect(() => {
    if (pickerOptions.length > 0) {
      setSelectedFile(pickerOptions[0].value);
    }
  }, [pickerOptions]);

  const handleDownloadFile = async () => {
    if (!selectedFile) {
      return;
    }

    if (Platform.OS === "web") {
      const link = document.createElement("a");
      link.href = selectedFile;
      link.download = selectedFile.split("/").pop() || "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const destination = new Directory(Paths.cache, "videos");

      try {
        if (!destination.exists) {
          destination.create();
        }

        toggleModal(false);
        Toast.show({ type: "info", text1: t("downloadStarted") });

        const fileName = sanitizeFileName(videoData?.name) || "video";
        const fileDownloadUrl = destination.uri + `/${fileName || "video"}.mp4`;

        const output = await File.downloadFileAsync(selectedFile, new File(fileDownloadUrl));

        await MediaLibrary.requestPermissionsAsync(true);

        await MediaLibrary.saveToLibraryAsync(output.uri);

        output.delete();

        const ellipsizedFileName = fileName.length > 10 ? fileName.slice(0, 10) + "..." : fileName;
        Toast.show({ type: "info", text1: t("downloadComplete", { fileName: ellipsizedFileName }) });
      } catch (error) {
        Toast.show({ type: "info", text1: t("downloadError"), props: { isError: true } });
        console.error("Error downloading file:", error);
      }
    }
  };

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
