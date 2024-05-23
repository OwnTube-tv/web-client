import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorSchemeContext } from "../contexts";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { HomeScreen, SettingsScreen, VideoScreen } from "../screens";
import { ROUTES } from "../types";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const { scheme } = useColorSchemeContext();
  const theme = scheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Screen
          name={ROUTES.HOME}
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Home",
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate(ROUTES.SETTINGS)}>
                <Feather name="settings" size={24} color={theme.colors.primary} />
              </Pressable>
            ),
          })}
        />
        <Stack.Screen options={{ title: "Settings" }} name={ROUTES.SETTINGS} component={SettingsScreen} />
        <Stack.Screen options={{ title: "Video" }} name={ROUTES.VIDEO} component={VideoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export type RootStackParams = {
  [ROUTES.HOME]: undefined;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.VIDEO]: undefined;
};
