import { HomeScreen } from "../../screens";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { writeToAsyncStorage } from "../../utils";
import { ROUTES, STORAGE } from "../../types";
import { RootStackParams } from "../_layout";
import { useRecentInstances } from "../../hooks";
import { Platform, TVEventControl } from "react-native";
import Head from "expo-router/head";
import Constants from "expo-constants";
import { useAppConfigContext } from "../../contexts";

export default function home() {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.HOME]>();
  const { recentInstances, addRecentInstance } = useRecentInstances();
  const { currentInstanceConfig } = useAppConfigContext();

  useEffect(() => {
    if (backend) {
      writeToAsyncStorage(STORAGE.DATASOURCE, backend);

      if (recentInstances?.[0] !== backend) {
        addRecentInstance(backend);
      }
    }
  }, [backend, recentInstances]);

  useFocusEffect(
    useCallback(() => {
      if (!Platform.isTV) return;

      TVEventControl.disableTVMenuKey();

      return () => TVEventControl.enableTVMenuKey();
    }, []),
  );

  if (!backend) {
    return null;
  }

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>
              {currentInstanceConfig?.customizations?.pageTitle ??
                `${backend ? backend + " @" : ""} ${Constants.expoConfig?.name}`}
            </title>
            <meta name="description" content="Homepage" />
          </Head>
        ),
      })}
      <HomeScreen />
    </>
  );
}
