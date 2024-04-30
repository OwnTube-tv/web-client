import { View, Text, Switch } from "react-native";
import { SourceSelect } from "../../components";
import { useAppConfigContext } from "../../contexts";
import { styles } from "./styles";

export const SettingsScreen = () => {
  const { isDebugMode, setIsDebugMode } = useAppConfigContext();

  return (
    <View style={styles.container}>
      <View style={styles.option}>
        <Text>Debug logging</Text>
        <Switch value={isDebugMode} onValueChange={setIsDebugMode} />
      </View>

      <SourceSelect />
    </View>
  );
};
