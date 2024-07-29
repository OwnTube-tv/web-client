import { Link, useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ROUTES, SOURCES, STORAGE } from "../../types";
import { readFromAsyncStorage, writeToAsyncStorage } from "../../utils";
import { DeviceCapabilitiesModal, IcoMoonIcon, Loader } from "../../components";
import { useCallback, useState } from "react";
import Head from "expo-router/head";
import { HomeScreen } from "../../screens";
import { useTheme } from "@react-navigation/native";
import { Platform, StyleSheet, View } from "react-native";
import { useRecentInstances } from "../../hooks";
import { RootStackParams } from "../_layout";
import { useTranslation } from "react-i18next";

export default function index() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const [isGettingStoredBackend, setIsGettingStoredBackend] = useState(true);
  const { recentInstances, addRecentInstance } = useRecentInstances();
  const { t } = useTranslation();

  const getSourceAndRedirect = async () => {
    if (backend) {
      setIsGettingStoredBackend(false);
      return;
    }

    const source = await readFromAsyncStorage(STORAGE.DATASOURCE);
    setIsGettingStoredBackend(false);

    router.setParams({ backend: source || SOURCES.PEERTUBE });

    if (!source) {
      await writeToAsyncStorage(STORAGE.DATASOURCE, SOURCES.PEERTUBE);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (backend) {
        navigation.setOptions({
          title: `${t("appName")}@${backend}`,
          headerRight: () => (
            <View style={styles.headerControls}>
              <Link
                style={styles.headerButton}
                href={{ pathname: `/${ROUTES.SETTINGS}`, params: { backend, tab: "history" } }}
              >
                <IcoMoonIcon name="Settings" size={24} color={theme.colors.primary} />
              </Link>
              <DeviceCapabilitiesModal />
            </View>
          ),
        });

        if (!(recentInstances?.[0] === backend)) {
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
              {t("appName")}@{backend || ""}
            </title>
            <meta name="description" content="OwnTube.tv homepage" />
          </Head>
        ),
      })}
      {!!backend && <HomeScreen />}
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 11,
  },
  headerControls: { alignItems: "center", flexDirection: "row", paddingRight: 11 },
});
