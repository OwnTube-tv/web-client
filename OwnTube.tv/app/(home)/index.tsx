import { Link, useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ROUTES, SOURCES, STORAGE } from "../../types";
import { readFromAsyncStorage, writeToAsyncStorage } from "../../utils";
import { Loader } from "../../components";
import { useCallback, useState } from "react";
import Head from "expo-router/head";
import { HomeScreen } from "../../screens";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export default function index() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const { backend } = useLocalSearchParams();
  const [isGettingStoredBackend, setIsGettingStoredBackend] = useState(true);

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
          title: `OwnTube.tv@${backend}`,
          headerRight: () => (
            <Link style={styles.headerButton} href={{ pathname: `/${ROUTES.SETTINGS}`, params: { backend } }}>
              <Feather name="settings" size={24} color={theme.colors.primary} />
            </Link>
          ),
        });
      }

      getSourceAndRedirect();
    }, [backend]),
  );

  if (isGettingStoredBackend) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>OwnTube.tv@{backend || ""}</title>
        <meta name="description" content="OwnTube.tv homepage" />
      </Head>
      {!!backend && <HomeScreen />}
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 11,
  },
});
