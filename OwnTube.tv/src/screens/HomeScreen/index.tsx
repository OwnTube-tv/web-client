import { Image, ScrollView, View } from "react-native";
import { Header, VideoDataService } from "../../../components";
import { styles } from "./styles";
import { useTheme } from "@react-navigation/native";

const images = {
  dark: require("../../../assets/logoDark-160x160.png"),
  light: require("../../../assets/Logo160x160.png"),
};

export const HomeScreen = () => {
  const theme = useTheme();

  const logoSource = theme.dark ? images.dark : images.light;

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Image source={logoSource} style={styles.logo} />
        <Header />
        <VideoDataService />
      </View>
    </ScrollView>
  );
};
