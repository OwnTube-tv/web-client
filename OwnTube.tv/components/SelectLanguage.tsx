import { Spacer } from "./shared/Spacer";
import { Typography } from "./Typography";
import { ComboBoxInput } from "./ComboBoxInput";
import { FALLBACK_LANG, LANGUAGE_OPTIONS } from "../i18n";
import { useSelectLocale } from "../hooks";
import { View } from "react-native";
import { IconButton } from "./IconButton";

export const SelectLanguage = () => {
  const { currentLang, handleChangeLang, t, selectedLang, handleResetLang, defaultLang } = useSelectLocale();

  return (
    <>
      <Spacer height={16} />
      <View>
        <Typography>
          {t("selectedLanguage", {
            selectedLang: selectedLang || t("selectedLangNone"),
            availableLanguages: Object.values(LANGUAGE_OPTIONS)
              .map(({ value }) => value)
              .join(";"),
            fallback: FALLBACK_LANG,
          })}
        </Typography>
        {defaultLang !== currentLang && (
          <IconButton onPress={handleResetLang} text={t("resetSelection")} icon="Trash" />
        )}
      </View>
      <Spacer height={16} />
      <ComboBoxInput
        searchable={false}
        value={currentLang}
        data={LANGUAGE_OPTIONS}
        onChange={handleChangeLang}
        testID="language-selector"
        placeholder={t("selectLanguage")}
      />
    </>
  );
};
