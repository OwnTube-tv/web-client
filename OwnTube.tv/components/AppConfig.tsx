import { DeviceCapabilities } from "./DeviceCapabilities";
import { StyleSheet, Switch, View } from "react-native";
import { Typography } from "./Typography";
import { useAppConfigContext, useColorSchemeContext } from "../contexts";

export const AppConfig = () => {
  const { isDebugMode, setIsDebugMode } = useAppConfigContext();
  const { scheme, toggleScheme } = useColorSchemeContext();

  return (
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deviceInfoAndToggles: { flexDirection: "row", flexWrap: "wrap", gap: 16, width: "100%" },
  option: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  togglesContainer: { flex: 1, minWidth: 200 },
});
