import { Pressable, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { Spacer } from "./shared/Spacer";
import { useAppConfigContext } from "../contexts";
import { useTheme } from "@react-navigation/native";

export const DeviceCapabilities = () => {
  const { deviceCapabilities } = useAppConfigContext();
  const { colors } = useTheme();

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(JSON.stringify(deviceCapabilities));
  };

  return (
    <View style={[{ backgroundColor: colors.card }, styles.modalContainer]}>
      <View style={styles.modalHeader}>
        <Typography>Device Capability info:</Typography>
        <Pressable onPress={handleCopyToClipboard}>
          <Ionicons color={colors.primary} name="copy" size={24} />
        </Pressable>
      </View>
      <Spacer height={16} />
      <View style={styles.row}>
        <Typography>Player implementation:</Typography>
        <Typography>{deviceCapabilities.playerImplementation}</Typography>
      </View>
      <View style={styles.row}>
        <Typography>Device type:</Typography>
        <Typography>{deviceCapabilities.deviceType}</Typography>
      </View>
      <View style={styles.row}>
        <Typography>Operating system:</Typography>
        <Typography>{deviceCapabilities.OS}</Typography>
      </View>
      {deviceCapabilities.browser && (
        <View style={styles.row}>
          <Typography>Browser:</Typography>
          <Typography>{deviceCapabilities.browser}</Typography>
        </View>
      )}
      {deviceCapabilities.device && (
        <View style={styles.row}>
          <Typography>Device:</Typography>
          <Typography>{deviceCapabilities.device}</Typography>
        </View>
      )}
      <View style={styles.row}>
        <Typography>Screen dimensions:</Typography>
        <Typography>{deviceCapabilities.dimensions}</Typography>
      </View>
      <View style={styles.row}>
        <Typography>Orientation:</Typography>
        <Typography>{deviceCapabilities.orientation}</Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: { borderRadius: 8, minWidth: "50%", padding: 16 },
  modalHeader: { flexDirection: "row", gap: 16, justifyContent: "space-between" },
  row: { flexWrap: "wrap", justifyContent: "space-between", marginVertical: 8, width: "100%" },
});
