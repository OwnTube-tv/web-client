import { CategoriesScreen } from "../../screens";
import { Platform } from "react-native";
import Head from "expo-router/head";
import { useTranslation } from "react-i18next";

export default function categories() {
  const { t } = useTranslation();

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>{t("categories")}</title>
            <meta name="description" content="Categories list" />
          </Head>
        ),
      })}
      <CategoriesScreen />
    </>
  );
}
