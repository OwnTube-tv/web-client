import { SignIn } from "../../screens";
import { Platform } from "react-native";
import Head from "expo-router/head";
import { useTranslation } from "react-i18next";

export default function signin() {
  const { t } = useTranslation();

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <title>{t("signIn")}</title>
          </Head>
        ),
      })}
      <SignIn />
    </>
  );
}
