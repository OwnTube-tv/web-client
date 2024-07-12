import { DeviceCapabilities } from "./DeviceCapabilities";
import { StyleSheet, Switch, View } from "react-native";
import { Typography } from "./Typography";
import { useAppConfigContext, useColorSchemeContext } from "../contexts";
import { useTranslation } from "react-i18next";
import { ComboBoxInput } from "./ComboBoxInput";
import { LANGUAGE_OPTIONS } from "../i18n";
import { writeToAsyncStorage } from "../utils";
import { STORAGE } from "../types";
import { Spacer } from "./shared/Spacer";

export const AppConfig = () => {
  const { isDebugMode, setIsDebugMode } = useAppConfigContext();
  const { scheme, toggleScheme } = useColorSchemeContext();
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (langCode: string) => {
    writeToAsyncStorage(STORAGE.LOCALE, langCode);
    i18n.changeLanguage(langCode);
  };

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
        <Spacer height={16} />
        <Typography>{t("selectedLanguage", { lang: i18n.language })}</Typography>
        <Spacer height={16} />
        <ComboBoxInput
          searchable={false}
          value={i18n.language}
          data={LANGUAGE_OPTIONS}
          onChange={handleChangeLanguage}
          testID="language-selector"
          placeholder={t("selectLanguage")}
        />
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
