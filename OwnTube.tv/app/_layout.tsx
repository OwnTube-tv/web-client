import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { ROUTES } from "../types";
import { Feather } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { AppConfigContextProvider, ColorSchemeContextProvider, useColorSchemeContext } from "../contexts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const RootStack = () => {
  const { backend } = useLocalSearchParams();
  const { scheme } = useColorSchemeContext();
  const theme = scheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen
          name={"(home)/index"}
          options={{
            headerBackVisible: false,
            title: "OwnTube.tv",
            headerLeft: () => <></>,
            headerRight: () => <></>,
          }}
        />
        <Stack.Screen
          options={{
            title: "Settings",
            headerBackVisible: false,
            headerLeft: () => (
              <Link style={styles.headerButton} href={{ pathname: "/", params: { backend } }}>
                <Feather name="home" size={24} color={theme.colors.primary} />
              </Link>
            ),
          }}
          name={`(home)/${ROUTES.SETTINGS}`}
        />
        <Stack.Screen options={{ title: "Video" }} name={`(home)/video`} />
      </Stack>
    </ThemeProvider>
  );
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const isWeb = Platform.OS === "web";

  return (
    <QueryClientProvider client={queryClient}>
      <AppConfigContextProvider>
        {isWeb && <ReactQueryDevtools initialIsOpen={false} />}
        <ColorSchemeContextProvider>
          <RootStack />
        </ColorSchemeContextProvider>
      </AppConfigContextProvider>
    </QueryClientProvider>
  );
}

export const unstable_settings = {
  initialRouteName: "(home)/index",
};

export type RootStackParams = {
  [ROUTES.INDEX]: { backend: string };
  [ROUTES.SETTINGS]: { backend: string };
  [ROUTES.VIDEO]: { backend: string; id: string };
};

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 11,
  },
});
