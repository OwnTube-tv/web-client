import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "./theme/themeContext";
import theme from "./theme/theme";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Screens/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  const [darkmode, setDarkMode] = useState(false);
  useEffect(() => {
    const listener = EventRegister.addEventListener("ChangeTheme", (data) => {
      setDarkMode(data);
      console.log(data);
    });
    return () => {
      EventRegister.removeAllListeners(listener);
    };
  }, [darkmode]);

  return (
    <themeContext.Provider value={darkmode === true ? theme.dark : theme.light}>
      <NavigationContainer theme={darkmode === true ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </themeContext.Provider>
  );
}
