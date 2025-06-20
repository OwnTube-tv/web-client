import { Otp } from "../../screens";
import { Platform } from "react-native";
import Head from "expo-router/head";
import { useTranslation } from "react-i18next";
import { useAuthSessionStore } from "../../store";
import { ROUTES } from "../../types";
import { useLocalSearchParams, Redirect } from "expo-router";

export default function otp() {
  const { t } = useTranslation();
  const { session } = useAuthSessionStore();
  const { backend } = useLocalSearchParams<{ backend: string }>();

  if (session) {
    return <Redirect href={{ pathname: ROUTES.HOME, params: { backend } }} />;
  }

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <title>{t("twoFactorAuth")}</title>
          </Head>
        ),
      })}
      <Otp />
    </>
  );
}
