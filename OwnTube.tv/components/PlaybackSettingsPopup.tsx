import { Platform, Pressable, StyleSheet, View } from "react-native";
import { borderRadius, spacing } from "../theme";
import { useTheme } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { Typography } from "./Typography";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { Spacer } from "./shared/Spacer";
import { useGetVideoCaptionsQuery, useGetVideoQuery } from "../api";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";
import { useHoverState } from "../hooks";
import TVFocusGuideHelper from "./helpers/TVFocusGuideHelper";
import { useTranslation } from "react-i18next";
import { Setting } from "./shared";

interface PlaybackSettingsPopupProps {
  selectedSpeed: number;
  handleSetSpeed: (speed: number) => void;
  selectedQuality: string;
  handleSetQuality?: (quality: string) => void;
  onSelectOption?: () => void;
  handleSetCCLang?: (lang: string) => void;
  selectedCCLang?: string;
  isLiveVideo?: boolean;
  hlsAutoQuality?: number;
}

const OptionsHeader = ({ onBackPress, text }: { onBackPress: () => void; text: string }) => {
  const { colors } = useTheme();
  const { isHovered, toggleHovered } = useHoverState();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      onHoverOut={toggleHovered}
      onHoverIn={toggleHovered}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[
        styles.headerContainer,
        { backgroundColor: isHovered || (isFocused && Platform.isTV) ? colors.white10 : undefined },
      ]}
      onPress={onBackPress}
      hasTVPreferredFocus
    >
      <IcoMoonIcon name="Chevron-Left" size={24} color={colors.white94} />
      <Spacer width={spacing.xs} />
      <Typography fontSize="sizeXS" color={colors.white94} fontWeight="SemiBold">
        {text}
      </Typography>
    </Pressable>
  );
};

const Option = ({
  id,
  text,
  isSelected,
  onPress,
}: {
  id: string;
  text: string;
  isSelected: boolean;
  onPress: (arg: string) => void;
}) => {
  const { colors } = useTheme();
  const { isHovered, toggleHovered } = useHoverState();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      onHoverOut={toggleHovered}
      onHoverIn={toggleHovered}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[
        styles.optionContainer,
        { backgroundColor: isHovered || (isFocused && Platform.isTV) ? colors.white10 : undefined },
      ]}
      onPress={() => onPress(id)}
    >
      <View style={styles.optionContent}>
        {isSelected ? (
          <IcoMoonIcon name="Check" size={24} color={colors.white94} />
        ) : (
          <Spacer width={24} height={24 + Number(Platform.OS === "web") + 0.5 * Number(Platform.OS !== "web")} />
        )}
        <Spacer width={spacing.xs} />
        <Typography fontSize="sizeXS" color={colors.white94} fontWeight="Regular">
          {text}
        </Typography>
      </View>
    </Pressable>
  );
};

export const PlaybackSettingsPopup = ({
  selectedQuality,
  selectedSpeed,
  handleSetSpeed,
  handleSetQuality,
  onSelectOption,
  handleSetCCLang,
  selectedCCLang,
  isLiveVideo,
  hlsAutoQuality,
}: PlaybackSettingsPopupProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedScreen, setSelectedScreen] = useState<keyof typeof screens>("settings");
  const { id } = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const { data: videoData } = useGetVideoQuery({ id, enabled: false });
  const { data: videoCaptions } = useGetVideoCaptionsQuery(id, false);

  const screens = useMemo(() => {
    const qualityOptions = (
      videoData?.streamingPlaylists?.[0]?.files?.length ? videoData?.streamingPlaylists?.[0]?.files : videoData?.files
    )
      ?.map(({ resolution }) => ({ ...resolution, id: String(resolution.id) }))
      .concat([
        {
          id: "auto",
          label: `${t("auto")}${hlsAutoQuality && selectedQuality === "auto" ? " " + hlsAutoQuality + "p" : ""}`,
        },
      ]);
    const ccOptions = [{ id: "", label: t("off") }].concat(
      videoCaptions?.map(({ language }) => ({ id: language.id, label: language.label })) || [],
    );

    return {
      settings: (
        [
          ...(isLiveVideo
            ? []
            : [
                {
                  name: t("playbackSpeed"),
                  id: "playbackSpeed",
                  state: selectedSpeed === 1 ? t("normal") : String(selectedSpeed),
                },
              ]),
          ...(Number(ccOptions?.length) > 1 && Boolean(handleSetCCLang)
            ? [
                {
                  name: t("subtitlesCC"),
                  id: "captions",
                  state: ccOptions?.find(({ id }) => selectedCCLang === id)?.label,
                },
              ]
            : []),
          ...(handleSetQuality
            ? [
                {
                  name: t("quality"),
                  id: "quality",
                  state: qualityOptions?.find(({ id }) => selectedQuality === id)?.label,
                },
              ]
            : []),
        ] as const
      ).map(({ name, id, state }) => (
        <Setting key={id} name={name} state={state} onPress={() => setSelectedScreen(id as keyof typeof screens)} />
      )),
      playbackSpeed: (
        <>
          <OptionsHeader text={t("playbackSpeed")} onBackPress={() => setSelectedScreen("settings")} />
          {[1.5, 1.25, 1, 0.75, 0.5].map((speed) => (
            <Option
              key={speed.toString()}
              id={speed.toString()}
              isSelected={speed === selectedSpeed}
              text={speed === 1 ? t("normal") : speed.toString()}
              onPress={(speed: string) => {
                handleSetSpeed(Number(speed));
                onSelectOption?.();
              }}
            />
          ))}
        </>
      ),
      quality: (
        <>
          <OptionsHeader text={t("quality")} onBackPress={() => setSelectedScreen("settings")} />
          {qualityOptions?.map(({ id, label }) => (
            <Option
              onPress={(quality: string) => {
                handleSetQuality?.(quality);
                onSelectOption?.();
              }}
              key={id}
              id={id}
              isSelected={id === selectedQuality}
              text={label}
            />
          ))}
        </>
      ),
      captions: (
        <>
          <OptionsHeader text={t("subtitlesCC")} onBackPress={() => setSelectedScreen("settings")} />
          {ccOptions?.map(({ id, label }) => (
            <Option
              onPress={(lang: string) => {
                handleSetCCLang?.(lang);
                onSelectOption?.();
              }}
              key={id}
              id={id}
              isSelected={id === selectedCCLang}
              text={label}
            />
          ))}
        </>
      ),
    };
  }, [colors, selectedSpeed, selectedQuality, videoData, t, selectedCCLang, handleSetCCLang, handleSetQuality]);

  return (
    <TVFocusGuideHelper style={[styles.container, { backgroundColor: colors.black80 }]}>
      {screens[selectedScreen]}
    </TVFocusGuideHelper>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.radiusMd,
    paddingVertical: spacing.sm,
    width: 256,
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  optionContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  optionContent: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
});
