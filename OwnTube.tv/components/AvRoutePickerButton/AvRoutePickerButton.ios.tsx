import AirPlayButton from "react-native-airplay-button";
import PlayerButton from "../VideoControlsOverlay/components/PlayerButton";
import { StyleSheet, View } from "react-native";
import { AvRoutePickerButtonProps } from "./AvRoutePickerButton.web";

const AvRoutePickerButton = (_props: AvRoutePickerButtonProps) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <AirPlayButton style={styles.airPlayTransparentButton} tintColor="transparent" activeTintColor="transparent" />
      <PlayerButton icon={"AirPlay"} onPress={null} />
    </View>
  );
};

const styles = StyleSheet.create({
  airPlayTransparentButton: { height: 48, left: 0, position: "absolute", top: 0, width: 48, zIndex: 1 },
  container: {
    height: 48,
    width: 48,
  },
});

export default AvRoutePickerButton;
