import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { Typography } from "./Typography";
import { useAppConfigContext } from "../contexts";
import { Spacer } from "./shared/Spacer";
import * as Clipboard from "expo-clipboard";
import { colors } from "../colors";

export const DeviceCapabilitiesModal = () => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible((prevState) => !prevState);
  };
  const { deviceCapabilities } = useAppConfigContext();

  return (
    <>
      <Pressable onPress={toggleModal}>
        <Ionicons size={24} color={colors.primary} name="information-circle" />
      </Pressable>
      <Modal style={styles.modal} transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
        <Pressable style={styles.showModalBtn} onPress={toggleModal}>
          <View style={[{ backgroundColor: colors.card }, styles.modalContainer]}>
            <View style={styles.modalHeader}>
              <Typography>Device Capability info:</Typography>
              <Pressable onPress={() => Clipboard.setStringAsync(JSON.stringify(deviceCapabilities))}>
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
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: { height: "100%" },
  modalContainer: { borderRadius: 8, minWidth: "50%", padding: 16 },
  modalHeader: { flexDirection: "row", gap: 16, justifyContent: "space-between" },
  row: { flexWrap: "wrap", justifyContent: "space-between", marginVertical: 8, width: "100%" },
  showModalBtn: {
    alignItems: "center",
    backgroundColor: colors._50percentBlackTint,
    flex: 1,
    justifyContent: "center",
  },
});
