import { CastButton } from "react-native-google-cast";
import { Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { GoogleCastButtonProps } from "./GoogleCastButton.web";
import { useBreakpoints } from "../../hooks";

const GoogleCastButton = (props: GoogleCastButtonProps) => {
  const { colors } = useTheme();
  const { isMobile } = useBreakpoints();

  if (Platform.isTV || !props.isChromeCastAvailable) return <></>;

  return <CastButton style={{ width: isMobile ? 42 : 48, height: 48, tintColor: colors.white80 }} />;
};

export default GoogleCastButton;
