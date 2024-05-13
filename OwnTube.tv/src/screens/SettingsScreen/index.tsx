import { View, Switch } from "react-native";
import { SourceSelect } from "../../../components";
import { useAppConfigContext } from "../../../contexts";
import { styles } from "./styles";
import { useTheme } from "@react-navigation/native";
import { useColorSchemeContext } from "../../../contexts";
import { Typography } from "../../../components";

export const SettingsScreen = () => {
  const { isDebugMode, setIsDebugMode } = useAppConfigContext();
  const theme = useTheme();

  const { scheme, toggleScheme } = useColorSchemeContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.option}>
        <Typography>Debug logging</Typography>
        <Switch value={isDebugMode} onValueChange={setIsDebugMode} />
      </View>
      <View style={styles.option}>
        <Typography>Use Light Theme</Typography>
        <Switch onValueChange={toggleScheme} value={scheme === "light"} />
      </View>
      <SourceSelect />
    </View>
  );
};
