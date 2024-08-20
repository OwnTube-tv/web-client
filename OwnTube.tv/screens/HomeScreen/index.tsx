import { ResumeWatching, VideoList } from "../../components";
import { Screen } from "../../layouts";
import { styles } from "./styles";
import { useTheme } from "@react-navigation/native";
import { Logo } from "../../components/Svg";

export const HomeScreen = () => {
  const { colors } = useTheme();

  return (
    <Screen style={{ ...styles.container, backgroundColor: colors.background }}>
      <Logo width={160} textColor={colors.theme950} />
      <ResumeWatching />
      <VideoList />
    </Screen>
  );
};
