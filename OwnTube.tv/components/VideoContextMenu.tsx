import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import TVFocusGuideHelper from "./helpers/TVFocusGuideHelper";
import { borderRadius, spacing } from "../theme";
import { Setting } from "./shared";
import { useTranslation } from "react-i18next";

interface VideoContextMenuProps {
  handleOpenSettings: () => void;
  handleDownload?: () => void;
}

export const VideoContextMenu: React.FC<VideoContextMenuProps> = ({ handleOpenSettings, handleDownload }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <TVFocusGuideHelper style={[styles.container, { borderColor: colors.white25, backgroundColor: colors.black80 }]}>
      <Setting
        isSubmenuAvailable={false}
        onPress={handleOpenSettings}
        name={t("settingsPageDeviceCapabilityInfoHeading")}
      />
      {!!handleDownload && <Setting isSubmenuAvailable={false} onPress={handleDownload} name={t("downloadVideo")} />}
    </TVFocusGuideHelper>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.radiusMd,
    borderWidth: 0.5,
    paddingVertical: spacing.sm,
  },
});

export default VideoContextMenu;
