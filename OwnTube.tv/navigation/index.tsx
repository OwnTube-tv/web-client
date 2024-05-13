import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorSchemeContext } from "../contexts";
import { HomeScreen, SettingsScreen } from "../src/screens";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const { scheme } = useColorSchemeContext();
  const theme = scheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Screen
          name={"Home"}
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Home",
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate("Settings")}>
                <Feather name="settings" size={24} color={theme.colors.primary} />
              </Pressable>
            ),
          })}
        />
        <Stack.Screen name={"Settings"} component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
