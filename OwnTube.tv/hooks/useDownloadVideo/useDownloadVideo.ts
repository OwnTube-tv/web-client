import { useGlobalSearchParams } from "expo-router";
import { useState, useMemo, useEffect } from "react";
import { useGetVideoQuery } from "../../api";
import { RootStackParams } from "../../app/_layout";
import { useFullScreenModalContext } from "../../contexts";
import { ROUTES } from "../../types";
import { formatFileSize } from "../../utils";
import { Linking } from "react-native";

const useDownloadVideo = () => {
  const { toggleModal } = useFullScreenModalContext();
  const params = useGlobalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const [selectedFile, setSelectedFile] = useState<string>();

  const { data: videoData } = useGetVideoQuery({ id: params?.id });

  const pickerOptions = useMemo(() => {
    if (videoData?.streamingPlaylists && Number(videoData?.streamingPlaylists?.length) > 0) {
      return videoData.streamingPlaylists[0].files.map((file) => ({
        label: `${file.resolution.label} (${formatFileSize(file.size)})`,
        value: file.fileDownloadUrl,
      }));
    }

    if (videoData?.files && Number(videoData?.files?.length) > 0) {
      return videoData.files.map((file) => ({
        label: `${file.resolution.label} (${formatFileSize(file.size)})`,
        value: file.fileDownloadUrl,
      }));
    }

    return [];
  }, [videoData]);

  useEffect(() => {
    if (pickerOptions && pickerOptions.length > 1) {
      const lowestQualityOption = pickerOptions.at(pickerOptions.at(-1)?.label.startsWith("Audio only") ? -2 : -1);

      if (lowestQualityOption) {
        setSelectedFile(lowestQualityOption.value);
      }
    }
  }, [pickerOptions]);

  const handleDownloadFile = async () => {
    if (!selectedFile) {
      return;
    }

    toggleModal(false);

    Linking.openURL(selectedFile);
  };

  return { handleDownloadFile, selectedFile, setSelectedFile, pickerOptions };
};

export default useDownloadVideo;
