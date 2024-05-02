import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";
import type { TRoutes } from "./";
import { HomeScreen, SettingsScreen } from "../screens";

export const routes: TRoutes = [
  {
    name: "Home",
    component: HomeScreen,
    options: ({ navigation }) => ({
      title: "Home",
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate("Settings")}>
          <Feather name="settings" size={24} color="black" />
        </Pressable>
      ),
    }),
  },
  {
    name: "Settings",
    component: SettingsScreen,
  },
];
