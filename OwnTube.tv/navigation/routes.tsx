import { Feather } from "@expo/vector-icons";
import { HomeScreen, SettingsScreen } from "../screens";
import { Button } from "../components";
import { ROUTES } from "../types";
import type { TRoutes } from "./";

export const routes: TRoutes = [
  {
    name: ROUTES.HOME,
    component: HomeScreen,
    options: ({ navigation }) => ({
      title: "Home",
      headerRight: () => (
        <Button onPress={() => navigation.navigate(ROUTES.SETTINGS)}>
          <Feather name="settings" size={24} color="black" />
        </Button>
      ),
    }),
  },
  {
    name: ROUTES.SETTINGS,
    component: SettingsScreen,
  },
];
