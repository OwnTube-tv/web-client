import { useFocusEffect, useRouter } from "expo-router";
import { ROUTES, STORAGE } from "../../types";
import { readFromAsyncStorage } from "../../utils";
import { Loader } from "../../components";
import { useCallback, useState } from "react";
import Head from "expo-router/head";
import { LandingScreen } from "../../screens";
import { Platform } from "react-native";
import Constants from "expo-constants";

export default function index() {
  const router = useRouter();
  const [isGettingStoredBackend, setIsGettingStoredBackend] = useState(true);

  const getSourceAndRedirect = async () => {
    const source = await readFromAsyncStorage(STORAGE.DATASOURCE);
    setIsGettingStoredBackend(false);

    if (source) {
      router.push({ pathname: `/${ROUTES.HOME}`, params: { backend: source } });
    }
  };

  useFocusEffect(
    useCallback(() => {
      getSourceAndRedirect();
    }, []),
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
            <title>{Constants.expoConfig?.name}</title>
            <meta name="description" content="homepage" />
          </Head>
        ),
      })}
      <LandingScreen />
    </>
  );
}
