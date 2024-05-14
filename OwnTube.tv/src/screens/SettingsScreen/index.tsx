import { View, Text, Switch } from "react-native";
import { SourceSelect } from "../../../components";
import { useAppConfigContext } from "../../../contexts";
import { styles } from "./styles";
import useTheme from "../../theme/useTheme";
import useThemedStyles from "../../theme/useThemedStyles";

export const SettingsScreen = () => {
  const { isDebugMode, setIsDebugMode } = useAppConfigContext();
  const theme = useTheme();
  const style = useThemedStyles(styles);

  return (
    <View style={style.container}>
      <View style={style.option}>
        <Text>Debug logging</Text>
        <Switch value={isDebugMode} onValueChange={setIsDebugMode} />
      </View>
      <View style={style.option}>
        <Text>Toggle Theme</Text>
        <Switch onValueChange={theme.toggleTheme} value={theme.isLightTheme} />
      </View>
      <SourceSelect />
    </View>
  );
};
