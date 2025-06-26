import { Directory, Paths, File } from "expo-file-system/next";
import { useGlobalSearchParams } from "expo-router";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { useGetVideoQuery } from "../../api";
import { RootStackParams } from "../../app/_layout";
import { useFullScreenModalContext } from "../../contexts";
import { ROUTES } from "../../types";
import { formatFileSize, sanitizeFileName } from "../../utils";
import * as MediaLibrary from "expo-media-library";

const useDownloadVideo = () => {
  const { toggleModal } = useFullScreenModalContext();
  const { t } = useTranslation();
  const params = useGlobalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const [selectedFile, setSelectedFile] = useState<string>();

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
  };

  return { handleDownloadFile, selectedFile, setSelectedFile, pickerOptions };
};

export default useDownloadVideo;
