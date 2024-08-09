import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { ModalContainer } from "../../../ModalContainer";
import { ScrollView, StyleSheet } from "react-native";
import { DeviceCapabilities } from "../../../DeviceCapabilities";
import { Spacer } from "../../../shared/Spacer";
import { spacing } from "../../../../theme";
import { Checkbox, Picker, Separator } from "../../../shared";
import { useAppConfigContext } from "../../../../contexts";
import { useSelectLocale } from "../../../../hooks";
import { LANGUAGE_OPTIONS } from "../../../../i18n";
import { useTheme } from "@react-navigation/native";

interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: SettingsProps) => {
  const { isDebugMode, setIsDebugMode } = useAppConfigContext();
  const { currentLang, handleChangeLang, t } = useSelectLocale();
  const { dark: isDarkTheme } = useTheme();

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
        </ScrollView>
      </ModalContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: { alignItems: "center", flex: 1, justifyContent: "center" },
  modalContainer: { maxHeight: "90%", maxWidth: "90%", width: 500 },
});
