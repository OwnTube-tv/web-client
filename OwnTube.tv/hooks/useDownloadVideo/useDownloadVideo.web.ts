import { useGlobalSearchParams } from "expo-router";
import { useState, useMemo, useEffect } from "react";
import { useGetVideoQuery } from "../../api";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { formatFileSize } from "../../utils";

const useDownloadVideo = () => {
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

    const link = document.createElement("a");
    link.href = selectedFile;
    link.download = selectedFile.split("/").pop() || "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { handleDownloadFile, selectedFile, setSelectedFile, pickerOptions };
};

export default useDownloadVideo;
