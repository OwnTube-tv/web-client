import { useBreakpoints } from "../../hooks";
import PlayerButton from "../VideoControlsOverlay/components/PlayerButton";

export interface AvRoutePickerButtonProps {
  isWebAirPlayAvailable?: boolean;
}

const AvRoutePickerButton = ({ isWebAirPlayAvailable }: AvRoutePickerButtonProps) => {
  const { isMobile } = useBreakpoints();
  const handleButtonPress = () => {
    const video = document.getElementsByTagName("video")[0];
    video.webkitShowPlaybackTargetPicker();
  };

  if (!isWebAirPlayAvailable) {
    return <></>;
  }

  return <PlayerButton reducedWidth={isMobile} icon={"AirPlay"} onPress={handleButtonPress} />;
};

export default AvRoutePickerButton;
