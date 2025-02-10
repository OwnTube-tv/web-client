import { useFocusEffect, useNavigation } from "expo-router";
import { STORAGE } from "../../types";
import { readFromAsyncStorage } from "../../utils";
import { Loader } from "../../components";
import { useCallback, useState } from "react";
import Head from "expo-router/head";
import { LandingScreen } from "../../screens";
import { Platform, TVEventControl } from "react-native";
import Constants from "expo-constants";
import { useAppConfigContext } from "../../contexts";
import { NavigationProp } from "@react-navigation/native";

export default function index() {
  const navigation = useNavigation<NavigationProp<{ "(home)/home": { backend: string } }>>();
  const [isGettingStoredBackend, setIsGettingStoredBackend] = useState(true);
  const { primaryBackend } = useAppConfigContext();

  const getSourceAndRedirect = async () => {
    if (primaryBackend) {
      navigation.reset({ routes: [{ name: "(home)/home", params: { backend: primaryBackend } }] });
      return;
    }

    const source = await readFromAsyncStorage(STORAGE.DATASOURCE);
    setIsGettingStoredBackend(false);

    if (source) {
      navigation.reset({ routes: [{ name: "(home)/home", params: { backend: source } }] });
    }
  };

  useFocusEffect(
    useCallback(() => {
      getSourceAndRedirect();

      if (!Platform.isTV) return;

      TVEventControl.disableTVMenuKey();

      return () => TVEventControl.enableTVMenuKey();
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
