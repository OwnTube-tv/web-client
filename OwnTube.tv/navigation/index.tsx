import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ComponentProps } from "react";
import { routes } from "./routes";

const Stack = createNativeStackNavigator();

export type TRoutes = ComponentProps<typeof Stack.Screen>[];

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {routes.map((route) => (
          <Stack.Screen {...route} key={route.name} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
