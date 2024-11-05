import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { ModalContainer } from "../../../ModalContainer";
import { ScrollView, StyleSheet, View } from "react-native";
import { DeviceCapabilities } from "../../../DeviceCapabilities";
import { Spacer } from "../../../shared/Spacer";
import { spacing } from "../../../../theme";
import { Button, Checkbox, Picker, Separator } from "../../../shared";
import { useAppConfigContext } from "../../../../contexts";
import { useSelectLocale } from "../../../../hooks";
import { LANGUAGE_OPTIONS } from "../../../../i18n";
import { useTheme } from "@react-navigation/native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Typography } from "../../../Typography";
import { RootStackParams } from "../../../../app/_layout";
import { writeToAsyncStorage } from "../../../../utils";
import { STORAGE } from "../../../../types";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { PeertubeInstance } from "../../../../api/models";
import Constants from "expo-constants";

interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: SettingsProps) => {
  const { backend } = useGlobalSearchParams<RootStackParams["index"]>();
  const { isDebugMode, setIsDebugMode } = useAppConfigContext();
  const { currentLang, handleChangeLang, t } = useSelectLocale();
  const { dark: isDarkTheme, colors } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const instanceName = useMemo(() => {
    const instanceInfo = queryClient.getQueryData<{ instance: PeertubeInstance }>(["instance", backend]);

    return instanceInfo?.instance?.name;
  }, [queryClient, backend]);

  const handleLeaveInstance = () => {
    writeToAsyncStorage(STORAGE.DATASOURCE, "").then(() => {
      onClose();
      router.navigate("/");
    });
  };

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={styles.animatedContainer} pointerEvents="box-none">
      <ModalContainer onClose={onClose} title={t("settingsPageTitle")} containerStyle={styles.modalContainer}>
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
            onValueChange={handleChangeLang}
            items={LANGUAGE_OPTIONS}
          />
          <Spacer height={spacing.xl} />
          <Checkbox checked={isDebugMode} onChange={setIsDebugMode} label={t("debugLogging")} />
          <Spacer height={spacing.xl} />
          <Separator />
          <Spacer height={spacing.xl} />
          <View style={{ alignSelf: "flex-start" }}>
            <Button
              onPress={handleLeaveInstance}
              contrast="none"
              icon="Exit"
              text={t("leaveInstance", { instance: instanceName })}
            />
          </View>
          <Spacer height={spacing.lg} />
          <Typography color={colors.themeDesaturated500} fontWeight="Regular" fontSize="sizeXS">
            {t("leaveInstanceDescription", { appName: Constants.expoConfig?.name })}
          </Typography>
        </ScrollView>
      </ModalContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: { alignItems: "center", flex: 1, justifyContent: "center" },
  modalContainer: { maxHeight: "90%", maxWidth: "90%", width: 500 },
});
