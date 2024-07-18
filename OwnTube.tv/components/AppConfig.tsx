import { DeviceCapabilities } from "./DeviceCapabilities";
import { StyleSheet, Switch, View } from "react-native";
import { Typography } from "./Typography";
import { useAppConfigContext, useColorSchemeContext } from "../contexts";
import { useTranslation } from "react-i18next";
import { SelectLanguage } from "./SelectLanguage";

export const AppConfig = () => {
  const { isDebugMode, setIsDebugMode } = useAppConfigContext();
  const { scheme, toggleScheme } = useColorSchemeContext();
  const { t } = useTranslation();

  return (
    <View style={styles.deviceInfoAndToggles}>
      <DeviceCapabilities />
      <View style={styles.togglesContainer}>
        <View style={styles.option}>
          <Typography>{t("debugLogging")}</Typography>
          <Switch value={isDebugMode} onValueChange={setIsDebugMode} />
        </View>
        <View style={styles.option}>
          <Typography>{t("toggleTheme")}</Typography>
          <Switch value={scheme === "light"} onValueChange={toggleScheme} />
        </View>
        <SelectLanguage />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deviceInfoAndToggles: { flexDirection: "row", flexWrap: "wrap", gap: 16, width: "100%" },
  option: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  togglesContainer: { flex: 1, minWidth: 200 },
});
