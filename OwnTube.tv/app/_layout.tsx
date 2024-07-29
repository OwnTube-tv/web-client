import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { ROUTES, STORAGE } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { AppConfigContextProvider, ColorSchemeContextProvider, useColorSchemeContext } from "../contexts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import { BuildInfoToast, ClickableHeaderText } from "../components";
import "../i18n";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { readFromAsyncStorage } from "../utils";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootStack = () => {
  const { backend } = useLocalSearchParams();
  const { scheme } = useColorSchemeContext();
  const theme = scheme === "dark" ? DarkTheme : DefaultTheme;
  const { t, i18n } = useTranslation();

  useEffect(() => {
    readFromAsyncStorage(STORAGE.LOCALE).then(i18n.changeLanguage);
  }, []);

  return (
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerTitle: ({ children }) => <ClickableHeaderText>{children}</ClickableHeaderText>,
        }}
      >
        <Stack.Screen
          name={"(home)/index"}
          options={{
            headerBackVisible: false,
            title: t("appName"),
            headerLeft: () => <></>,
            headerRight: () => <></>,
          }}
        />
        <Stack.Screen
          options={{
            title: t("settingsPageTitle"),
            headerBackVisible: false,
            headerLeft: () => (
              <Link style={styles.headerButtonLeft} href={{ pathname: "/", params: { backend } }}>
                <Ionicons name="home" size={24} color={theme.colors.primary} />
              </Link>
            ),
          }}
          name={`(home)/${ROUTES.SETTINGS}`}
        />
        <Stack.Screen options={{ title: t("videoPageTitle"), headerShown: false }} name={`(home)/video`} />
      </Stack>
      <Toast config={{ buildInfo: () => <BuildInfoToast /> }} />
    </ThemeProvider>
  );
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const isWeb = Platform.OS === "web";

  const [fontsLoaded, fontError] = useFonts(Ionicons.font);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
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
  );
}

export const unstable_settings = {
  initialRouteName: "(home)/index",
};

export type RootStackParams = {
  [ROUTES.INDEX]: { backend: string };
  [ROUTES.SETTINGS]: { backend: string; tab: "history" | "instance" | "config" };
  [ROUTES.VIDEO]: { backend: string; id: string; timestamp?: string };
};

const styles = StyleSheet.create({
  headerButtonLeft: {
    paddingLeft: 11,
  },
});
