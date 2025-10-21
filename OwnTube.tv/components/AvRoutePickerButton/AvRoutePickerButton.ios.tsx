import AirPlayButton from "react-native-airplay-button";
import PlayerButton from "../VideoControlsOverlay/components/PlayerButton";
import { StyleSheet, View } from "react-native";
import { AvRoutePickerButtonProps } from "./AvRoutePickerButton.web";
import { useBreakpoints } from "../../hooks";

const AvRoutePickerButton = (_props: AvRoutePickerButtonProps) => {
  const { isMobile } = useBreakpoints();

  return (
    <View style={[styles.container, { width: isMobile ? 42 : 48 }]} pointerEvents="box-none">
      <AirPlayButton
        style={{ ...styles.airPlayTransparentButton, width: isMobile ? 42 : 48 }}
        tintColor="transparent"
        activeTintColor="transparent"
      />
      <PlayerButton reducedWidth={isMobile} icon={"AirPlay"} onPress={null} />
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
