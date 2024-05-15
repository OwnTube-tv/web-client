import { View, Text, Switch } from "react-native";
import { SourceSelect } from "../../components";
import { useAppConfigContext, useTheme } from "../../contexts";
import { useThemedStyles } from "../../hooks";
import { Screen } from "../../layouts";
import { styles } from "./styles";

export const SettingsScreen = () => {
  const { isDebugMode, setIsDebugMode } = useAppConfigContext();
  const { toggleTheme, isLightTheme } = useTheme();
  const style = useThemedStyles(styles);

  return (
    <Screen style={style.container}>
      <View style={style.option}>
        <Text>Debug logging</Text>
        <Switch value={isDebugMode} onValueChange={setIsDebugMode} />
      </View>
      <View style={style.option}>
        <Text>Toggle Theme</Text>
        <Switch value={isLightTheme} onValueChange={toggleTheme} />
      </View>
      <SourceSelect />
    </Screen>
  );
};
