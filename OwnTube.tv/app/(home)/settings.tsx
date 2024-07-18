import { SettingsScreen } from "../../screens";
import Head from "expo-router/head";
import { useTranslation } from "react-i18next";

export default function settings() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("settingsPageTitle")}</title>
        <meta name="description" content={`${t("appName")} ${t("settingsPageTitle").toLowerCase()}`} />
      </Head>
      <SettingsScreen />
    </>
  );
}
