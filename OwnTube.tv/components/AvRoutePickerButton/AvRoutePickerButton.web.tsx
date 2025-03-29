import PlayerButton from "../VideoControlsOverlay/components/PlayerButton";

export interface AvRoutePickerButtonProps {
  isWebAirPlayAvailable?: boolean;
}

const AvRoutePickerButton = ({ isWebAirPlayAvailable }: AvRoutePickerButtonProps) => {
  const handleButtonPress = () => {
    const video = document.getElementsByTagName("video")[0];
    video.webkitShowPlaybackTargetPicker();
  };

  if (!isWebAirPlayAvailable) {
    return <></>;
  }

  return <PlayerButton icon={"AirPlay"} onPress={handleButtonPress} />;
};

export default AvRoutePickerButton;
