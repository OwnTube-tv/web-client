import { CastButton } from "react-native-google-cast";
import { Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { GoogleCastButtonProps } from "./GoogleCastButton.web";

const GoogleCastButton = (props: GoogleCastButtonProps) => {
  const { colors } = useTheme();

  if (Platform.isTV || !props.isChromeCastAvailable) return <></>;

  return <CastButton style={{ width: 48, height: 48, tintColor: colors.white80 }} />;
};

export default GoogleCastButton;
