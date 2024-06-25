import { View, Switch } from "react-native";
import { SourceSelect, Typography, ViewHistory, DeviceCapabilities } from "../../components";
import { useAppConfigContext, useColorSchemeContext } from "../../contexts";
import { Screen } from "../../layouts";
import { styles } from "./styles";
import { useTheme } from "@react-navigation/native";

export const SettingsScreen = () => {
  const { isDebugMode, setIsDebugMode } = useAppConfigContext();
  const { scheme, toggleScheme } = useColorSchemeContext();
  const { colors } = useTheme();

  return (
    <Screen style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.deviceInfoAndToggles}>
        <DeviceCapabilities />
        <View style={styles.togglesContainer}>
          <View style={styles.option}>
            <Typography>Debug logging</Typography>
            <Switch value={isDebugMode} onValueChange={setIsDebugMode} />
          </View>
          <View style={styles.option}>
            <Typography>Toggle Theme</Typography>
            <Switch value={scheme === "light"} onValueChange={toggleScheme} />
          </View>
          <SourceSelect />
        </View>
      </View>
      <ViewHistory />
    </Screen>
  );
};
