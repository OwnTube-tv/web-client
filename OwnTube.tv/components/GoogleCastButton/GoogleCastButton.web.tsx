import PlayerButton from "../VideoControlsOverlay/components/PlayerButton";

export interface GoogleCastButtonProps {
  isChromeCastAvailable?: boolean;
  handleLoadGoogleCastMedia?: () => void;
}

const GoogleCastButton = ({ isChromeCastAvailable, handleLoadGoogleCastMedia }: GoogleCastButtonProps) => {
  if (!isChromeCastAvailable) {
    return null;
  }

  return <PlayerButton icon="Chromecast" onPress={handleLoadGoogleCastMedia} />;
};

export default GoogleCastButton;
