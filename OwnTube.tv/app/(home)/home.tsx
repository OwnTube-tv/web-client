import { HomeScreen } from "../../screens";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { writeToAsyncStorage } from "../../utils";
import { ROUTES, STORAGE } from "../../types";
import { RootStackParams } from "../_layout";
import { useInstanceConfig, useRecentInstances } from "../../hooks";
import { Platform } from "react-native";
import Head from "expo-router/head";
import Constants from "expo-constants";

export default function home() {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.HOME]>();
  const { recentInstances, addRecentInstance } = useRecentInstances();
  const { currentInstanceConfig } = useInstanceConfig();

  useEffect(() => {
    if (backend) {
      writeToAsyncStorage(STORAGE.DATASOURCE, backend);

      if (recentInstances?.[0] !== backend) {
        addRecentInstance(backend);
      }
    }
  }, [backend, recentInstances]);

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
