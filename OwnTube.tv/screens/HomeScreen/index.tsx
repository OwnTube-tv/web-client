import { Header, ResumeWatching, VideoList } from "../../components";
import { Screen } from "../../layouts";
import { styles } from "./styles";
import { useTheme } from "@react-navigation/native";
import { Image } from "react-native";

const images = {
  dark: require("../../assets/logoDark-160x160.png"),
  light: require("../../assets/Logo160x160.png"),
};

export const HomeScreen = () => {
  const theme = useTheme();

  const logoSource = theme.dark ? images.dark : images.light;

  return (
    <Screen style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <Image source={logoSource} width={160} height={160} />
      <Header />
      <ResumeWatching />
      <VideoList />
    </Screen>
  );
};
