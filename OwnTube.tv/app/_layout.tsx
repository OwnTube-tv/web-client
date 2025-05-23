import { useGlobalSearchParams, usePathname } from "expo-router";
import { Platform, TVEventControl } from "react-native";
import { ROUTES, STORAGE } from "../types";
import { ThemeProvider } from "@react-navigation/native";
import {
  AppConfigContextProvider,
  ColorSchemeContextProvider,
  FullScreenModalContextProvider,
  useColorSchemeContext,
  useFullScreenModalContext,
} from "../contexts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import { AppDesktopHeader, FullScreenModal, InfoToast, Sidebar, ErrorBoundary } from "../components";
import "../i18n";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";
import { readFromAsyncStorage } from "../utils";
import { colorSchemes } from "../theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { Drawer } from "expo-router/drawer";
import { AppHeader } from "../components/AppHeader";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useBreakpoints } from "../hooks";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { SHAREABLE_ROUTE_MODAL_TITLES } from "../navigation/constants";
import { GLOBAL_QUERY_STALE_TIME } from "../api";

export const CLOSED_DRAWER_WIDTH = 64;
export const OPEN_DRAWER_WIDTH = 272;

const RootStack = () => {
  const { scheme } = useColorSchemeContext();
  const theme = scheme === "dark" ? colorSchemes.dark : colorSchemes.light;
  const { i18n } = useTranslation();

  useEffect(() => {
    readFromAsyncStorage(STORAGE.LOCALE).then(i18n.changeLanguage);
  }, []);

  const breakpoints = useBreakpoints();
  const { backend } = useGlobalSearchParams<{ backend: string }>();
  const pathname = usePathname();
  const { left, top } = useSafeAreaInsets();

  const { isOpen: isModalOpen, content: modalContent, toggleModal } = useFullScreenModalContext();

  const renderAppHeader = useCallback(
    (props: DrawerHeaderProps) => {
      if (!backend) {
        return null;
      }

      if (breakpoints.isMobile) {
        return <AppHeader {...props} backend={backend} />;
      }

      if (
        Object.keys(SHAREABLE_ROUTE_MODAL_TITLES)
          .filter((route) => route !== `/${ROUTES.HOME}`)
          .includes(pathname)
      ) {
        return <AppDesktopHeader />;
      }

      return null;
    },
    [backend, breakpoints, pathname],
  );

  useEffect(() => {
    if (!Platform.isTV) return;

    TVEventControl.enableTVMenuKey();

    return () => {
      TVEventControl.disableTVMenuKey();
    };
  }, []);

  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <ThemeProvider value={theme}>
        <ErrorBoundary>
          <Drawer
            screenOptions={{
              drawerType: breakpoints.isMobile ? "front" : "permanent",
              drawerStyle: {
                display: !backend ? "none" : "flex",
                width:
                  (!breakpoints.isDesktop && !breakpoints.isMobile ? CLOSED_DRAWER_WIDTH : OPEN_DRAWER_WIDTH) + left,
                borderRightWidth: 0,
              },
              header: (props) => renderAppHeader(props),
            }}
            backBehavior="history"
            drawerContent={(props) => <Sidebar {...props} backend={backend} />}
          >
            <Drawer.Screen
              name={"(home)/index"}
              options={{ drawerStyle: { display: "none" }, swipeEnabled: false, header: () => <></> }}
            />
            <Drawer.Screen name={"(home)/home"} />
            <Drawer.Screen
              name={`(home)/video`}
              options={{ drawerStyle: { display: "none" }, swipeEnabled: false, header: () => <></> }}
            />
            <Drawer.Screen name={`(home)/${ROUTES.CHANNEL}`} />
            <Drawer.Screen name={`(home)/${ROUTES.CHANNELS}`} />
            <Drawer.Screen name={`(home)/${ROUTES.CHANNEL_CATEGORY}`} />
            <Drawer.Screen name={`(home)/${ROUTES.CHANNEL_PLAYLIST}`} />
            <Drawer.Screen name={`(home)/${ROUTES.CATEGORIES}`} />
            <Drawer.Screen name={`(home)/${ROUTES.CATEGORY}`} />
            <Drawer.Screen name={`(home)/${ROUTES.PLAYLISTS}`} />
            <Drawer.Screen name={`(home)/${ROUTES.PLAYLIST}`} />
          </Drawer>
          <Toast
            topOffset={top || undefined}
            config={{
              info: (props) => <InfoToast {...props} />,
            }}
          />
          <FullScreenModal onBackdropPress={() => toggleModal?.(false)} isVisible={isModalOpen}>
            {modalContent}
          </FullScreenModal>
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: GLOBAL_QUERY_STALE_TIME,
    },
  },
});

export default function RootLayout() {
  const isWeb = Platform.OS === "web";

  const [fontsLoaded, fontError] = useFonts({
    Inter_100Thin: require("../assets/fonts/Inter/Inter-Thin.otf"),
    Inter_200ExtraLight: require("../assets/fonts/Inter/Inter-ExtraLight.otf"),
    Inter_300Light: require("../assets/fonts/Inter/Inter-Light.otf"),
    Inter_400Regular: require("../assets/fonts/Inter/Inter-Regular.otf"),
    Inter_500Medium: require("../assets/fonts/Inter/Inter-Medium.otf"),
    Inter_600SemiBold: require("../assets/fonts/Inter/Inter-SemiBold.otf"),
    Inter_700Bold: require("../assets/fonts/Inter/Inter-Bold.otf"),
    Inter_800ExtraBold: require("../assets/fonts/Inter/Inter-ExtraBold.otf"),
    Inter_900Black: require("../assets/fonts/Inter/Inter-Black.otf"),
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
              <FullScreenModalContextProvider>
                <RootStack />
              </FullScreenModalContextProvider>
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
  [ROUTES.HOME]: { backend: string };
  [ROUTES.HISTORY]: { backend: string };
  [ROUTES.VIDEO]: { backend: string; id: string; timestamp?: string };
  [ROUTES.CHANNEL]: { backend: string; channel: string };
  [ROUTES.CHANNELS]: { backend: string };
  [ROUTES.CHANNEL_CATEGORY]: { backend: string; channel: string; category: string };
  [ROUTES.CHANNEL_PLAYLIST]: { backend: string; channel: string; playlist: string };
  [ROUTES.CATEGORIES]: { backend: string };
  [ROUTES.CATEGORY]: { backend: string; category: string };
  [ROUTES.PLAYLIST]: { backend: string; playlist: string };
};
