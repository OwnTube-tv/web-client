import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ROUTES, STORAGE } from "../../types";
import { readFromAsyncStorage, writeToAsyncStorage } from "../../utils";
import { Loader } from "../../components";
import { useCallback, useState } from "react";
import Head from "expo-router/head";
import { HomeScreen, LandingScreen } from "../../screens";
import { Platform } from "react-native";
import { useInstanceConfig, useRecentInstances } from "../../hooks";
import { RootStackParams } from "../_layout";
import { useTranslation } from "react-i18next";

export default function index() {
  const router = useRouter();
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const [isGettingStoredBackend, setIsGettingStoredBackend] = useState(true);
  const { recentInstances, addRecentInstance } = useRecentInstances();
  const { t } = useTranslation();
  const { currentInstanceConfig } = useInstanceConfig();

  const getSourceAndRedirect = async () => {
    if (backend) {
      setIsGettingStoredBackend(false);
      return;
    }

    const source = await readFromAsyncStorage(STORAGE.DATASOURCE);
    setIsGettingStoredBackend(false);

    if (source) {
      router.setParams({ backend: source });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (backend) {
        writeToAsyncStorage(STORAGE.DATASOURCE, backend);

        if (recentInstances?.[0] !== backend) {
          addRecentInstance(backend);
        }
      }

      getSourceAndRedirect();
    }, [backend, recentInstances]),
  );

  if (isGettingStoredBackend) {
    return <Loader />;
  }

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>
              {currentInstanceConfig?.customizations?.pageTitle ?? `${t("appName")}${backend ? "@" + backend : ""}`}
            </title>
            <meta name="description" content="OwnTube.tv homepage" />
          </Head>
        ),
      })}
      {backend ? <HomeScreen /> : <LandingScreen />}
    </>
  );
}
