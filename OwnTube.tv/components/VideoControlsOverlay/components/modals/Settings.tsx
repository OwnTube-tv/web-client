import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { ModalContainer } from "../../../ModalContainer";
import { ScrollView, StyleSheet, View } from "react-native";
import { Spacer } from "../../../shared/Spacer";
import { spacing } from "../../../../theme";
import { Button, Checkbox, Separator } from "../../../shared";
import { useAppConfigContext } from "../../../../contexts";
import { useSelectLocale } from "../../../../hooks";
import { LANGUAGE_OPTIONS } from "../../../../i18n";
import { useTheme } from "@react-navigation/native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Typography } from "../../../Typography";
import { RootStackParams } from "../../../../app/_layout";
import { writeToAsyncStorage } from "../../../../utils";
import { STORAGE } from "../../../../types";
import Constants from "expo-constants";
import DeviceCapabilities from "../../../DeviceCapabilities";
import Picker from "../../../shared/Picker";
import { useGetInstanceInfoQuery } from "../../../../api";
import { usePostHog } from "posthog-react-native/lib/posthog-react-native/src/hooks/usePostHog";
import { useState } from "react";
import { PostHogPersistedProperty } from "posthog-react-native/lib/posthog-core/src/types";

interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: SettingsProps) => {
  const { backend } = useGlobalSearchParams<RootStackParams["index"]>();
  const { isDebugMode, setIsDebugMode, primaryBackend } = useAppConfigContext();
  const { currentLang, handleChangeLang, t } = useSelectLocale();
  const { dark: isDarkTheme, colors } = useTheme();
  const router = useRouter();
  const posthog = usePostHog();

  const { data: instanceInfo } = useGetInstanceInfoQuery(backend);
  const { currentInstanceConfig } = useAppConfigContext();
  const [isOptedOut, setIsOptedOut] = useState(
    posthog.getPersistedProperty(PostHogPersistedProperty.OptedOut) || false,
  );

  const handleLeaveInstance = () => {
    writeToAsyncStorage(STORAGE.DATASOURCE, "").then(() => {
      onClose();
      router.navigate("/");
    });
  };

  const handleSelectLanguage = (langCode: string) => {
    handleChangeLang(langCode);
  };

  const handleToggleDebugMode = (debugModeOn: boolean) => {
    setIsDebugMode(debugModeOn);
    writeToAsyncStorage(STORAGE.DEBUG_MODE, String(debugModeOn));
  };

  const handleToggleOptOutCheckbox = (optOut: boolean) => {
    if (!optOut) {
      posthog.optIn();
    } else {
      posthog.optOut();
    }

    setIsOptedOut(optOut);
  };

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={styles.animatedContainer} pointerEvents="box-none">
      <ModalContainer
        showCloseButton
        onClose={onClose}
        title={t("settingsPageTitle")}
        containerStyle={styles.modalContainer}
      >
        <ScrollView>
          <Spacer height={spacing.sm} />
          <DeviceCapabilities />
          <Spacer height={spacing.xl} />
          <Separator />
          <Spacer height={spacing.xl} />
          <Picker
            darkTheme={isDarkTheme}
            placeholder={{}}
            value={currentLang}
            onValueChange={handleSelectLanguage}
            items={LANGUAGE_OPTIONS}
          />
          <Spacer height={spacing.xl} />
          <Checkbox
            disabled={isOptedOut}
            checked={isDebugMode && !isOptedOut}
            onChange={handleToggleDebugMode}
            label={t("debugLogging")}
          />
          <Spacer height={spacing.md} />
          <Checkbox checked={isOptedOut} onChange={handleToggleOptOutCheckbox} label={t("optOutOfDiagnostics")} />
          <Spacer height={spacing.xl} />
          {!primaryBackend && (
            <>
              <Separator />
              <Spacer height={spacing.xl} />
              <View style={{ alignSelf: "flex-start" }}>
                <Button
                  onPress={handleLeaveInstance}
                  contrast="none"
                  icon="Exit"
                  text={t("leaveInstance", {
                    instance: currentInstanceConfig?.customizations?.pageTitle || instanceInfo?.name,
                  })}
                />
              </View>
              <Spacer height={spacing.lg} />
              <Typography color={colors.themeDesaturated500} fontWeight="Regular" fontSize="sizeXS">
                {t("leaveInstanceDescription", { appName: Constants.expoConfig?.name })}
              </Typography>
            </>
          )}
        </ScrollView>
      </ModalContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: { alignItems: "center", flex: 1, justifyContent: "center" },
  modalContainer: { maxHeight: "90%", maxWidth: "90%", width: 500 },
});
