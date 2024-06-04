import { Stack, useNavigation } from "expo-router";
import { Pressable } from "react-native";
import { ROUTES } from "../types";
import { Feather } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme, NavigationProp, ThemeProvider } from "@react-navigation/native";
import { AppConfigContextProvider, ColorSchemeContextProvider, useColorSchemeContext } from "../contexts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const RootStack = () => {
  const { scheme } = useColorSchemeContext();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const theme = scheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen
          name={ROUTES.INDEX}
          options={{
            title: "Home",
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate(ROUTES.SETTINGS)}>
                <Feather name="settings" size={24} color={theme.colors.primary} />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen options={{ title: "Settings" }} name={ROUTES.SETTINGS} />
        <Stack.Screen options={{ title: "Video" }} name={ROUTES.VIDEO} />
      </Stack>
    </ThemeProvider>
  );
};

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppConfigContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <ColorSchemeContextProvider>
          <RootStack />
        </ColorSchemeContextProvider>
      </AppConfigContextProvider>
    </QueryClientProvider>
  );
}

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export type RootStackParams = {
  [ROUTES.INDEX]: undefined;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.VIDEO]: { id: string };
};
