import Constants from "expo-constants";
import Head from "expo-router/head";
import { t } from "i18next";
import { Platform } from "react-native";
import { SearchResultsScreen } from "../../screens";

export default function search() {
  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>{t("search")}</title>
            <meta name="description" content={`${Constants.expoConfig?.name} videos search`} />
          </Head>
        ),
      })}
      <SearchResultsScreen />
    </>
  );
}
