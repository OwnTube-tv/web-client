import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import Head from "expo-router/head";
import { CategoryScreen } from "../../screens";

export default function category() {
  const { t } = useTranslation();

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>{t("categoryView")}</title>
            <meta name="description" content="Category view" />
          </Head>
        ),
      })}
      <CategoryScreen />
    </>
  );
}
