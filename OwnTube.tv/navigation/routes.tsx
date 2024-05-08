import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";
import type { TRoutes } from "./";
import { HomeScreen, SettingsScreen, TestScreen , ProfileScreen  } from "../screens";

export const routes: TRoutes = [
  {
    name: "Home",
    component: HomeScreen,
    options: ({ navigation }) => ({
      title: "Home",
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Feather name="settings" size={24} color="black" />
        </Pressable>
      ),
    }),
  },
  {
    name: "Settings",
    component: SettingsScreen,
  },

 { 
    name: "Test",
    component: TestScreen,
 },

  { 
    name: "Profile",
    component: ProfileScreen,
  },


];
