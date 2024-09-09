import { useGlobalSearchParams } from "expo-router";
import { Platform } from "react-native";
import { ROUTES, STORAGE } from "../types";
import { ThemeProvider } from "@react-navigation/native";
import { AppConfigContextProvider, ColorSchemeContextProvider, useColorSchemeContext } from "../contexts";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import { BuildInfoToast, FullScreenModal, Sidebar } from "../components";
import "../i18n";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { readFromAsyncStorage } from "../utils";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { colorSchemes } from "../theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { Drawer } from "expo-router/drawer";
import { Settings } from "../components/VideoControlsOverlay/components/modals";
import { AppHeader } from "../components/AppHeader";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useBreakpoints } from "../hooks";
import { OwnTubeError } from "../api/models";

export const CLOSED_DRAWER_WIDTH = 64;
export const OPEN_DRAWER_WIDTH = 272;

const RootStack = () => {
  const { scheme } = useColorSchemeContext();
  const theme = scheme === "dark" ? colorSchemes.dark : colorSchemes.light;
  const { i18n } = useTranslation();

  useEffect(() => {
    readFromAsyncStorage(STORAGE.LOCALE).then(i18n.changeLanguage);
  }, []);

  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const breakpoints = useBreakpoints();
  const { backend } = useGlobalSearchParams<{ backend: string }>();
  const { left } = useSafeAreaInsets();

  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <ThemeProvider value={theme}>
        <Drawer
          screenOptions={{
            drawerType: breakpoints.isMobile ? "front" : "permanent",
            drawerStyle: {
              display: !backend ? "none" : "flex",
              width: (!breakpoints.isDesktop && !breakpoints.isMobile ? CLOSED_DRAWER_WIDTH : OPEN_DRAWER_WIDTH) + left,
              borderRightWidth: 0,
            },
            header: (props) => (breakpoints.isMobile && !!backend ? <AppHeader {...props} backend={backend} /> : <></>),
          }}
          backBehavior="history"
          drawerContent={(props) => (
            <Sidebar {...props} handleOpenSettings={() => setIsSettingsModalVisible(true)} backend={backend} />
          )}
        >
          <Drawer.Screen name={"(home)/index"} />
          <Drawer.Screen name={`(home)/${ROUTES.SETTINGS}`} />
          <Drawer.Screen
            name={`(home)/video`}
            options={{ drawerStyle: { display: "none" }, swipeEnabled: false, header: () => <></> }}
          />
          <Drawer.Screen name={`(home)/${ROUTES.CHANNEL}`} />
          <Drawer.Screen name={`(home)/${ROUTES.CHANNELS}`} />
          <Drawer.Screen name={`(home)/${ROUTES.CATEGORIES}`} />
          <Drawer.Screen name={`(home)/${ROUTES.PLAYLISTS}`} />
        </Drawer>
        <Toast config={{ buildInfo: () => <BuildInfoToast /> }} />
        <FullScreenModal onBackdropPress={() => setIsSettingsModalVisible(false)} isVisible={isSettingsModalVisible}>
          <Settings onClose={() => setIsSettingsModalVisible(false)} />
        </FullScreenModal>
      </ThemeProvider>
    </>
  );
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: Error) => {
      const errorInfo = (error as unknown as OwnTubeError).text || error.message;

      console.error(`Error ${(error as unknown as OwnTubeError).code}, ${errorInfo}`);

      Toast.show({
        type: "error",
        text1: `Error ${(error as unknown as OwnTubeError).code}`,
        text2: errorInfo,
        autoHide: false,
      });
    },
  }),
});

export default function RootLayout() {
  const isWeb = Platform.OS === "web";

  const [fontsLoaded, fontError] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    IcoMoon: require("../assets/fonts/icomoon.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <QueryClientProvider client={queryClient}>
          <AppConfigContextProvider>
            {isWeb && <ReactQueryDevtools initialIsOpen={false} />}
            <ColorSchemeContextProvider>
              <RootStack />
            </ColorSchemeContextProvider>
          </AppConfigContextProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export const unstable_settings = {
  initialRouteName: "(home)/index",
};

export type RootStackParams = {
  [ROUTES.INDEX]: { backend: string };
  [ROUTES.SETTINGS]: { backend: string; tab: "history" | "instance" | "config" };
  [ROUTES.VIDEO]: { backend: string; id: string; timestamp?: string };
  [ROUTES.CHANNEL]: { backend: string; channel: string };
  [ROUTES.CHANNELS]: { backend: string };
  [ROUTES.CATEGORIES]: { backend: string };
};
