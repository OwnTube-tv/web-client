import { useBreakpoints } from "../../hooks";
import PlayerButton from "../VideoControlsOverlay/components/PlayerButton";

export interface GoogleCastButtonProps {
  isChromeCastAvailable?: boolean;
  handleLoadGoogleCastMedia?: () => void;
}

const GoogleCastButton = ({ isChromeCastAvailable, handleLoadGoogleCastMedia }: GoogleCastButtonProps) => {
  const { isMobile } = useBreakpoints();
  if (!isChromeCastAvailable) {
    return null;
  }

  return <PlayerButton reducedWidth={isMobile} icon="Chromecast" onPress={handleLoadGoogleCastMedia} />;
};

export default GoogleCastButton;
