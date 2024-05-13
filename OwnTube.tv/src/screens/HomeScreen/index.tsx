import { Image, ScrollView, View } from "react-native";
import { Header, VideoDataService } from "../../../components";
import { styles } from "./styles";
import { useTheme } from "@react-navigation/native";

export const HomeScreen = () => {
  const theme = useTheme();

  const logoUri = theme.dark ? "../../assets/logoDark-160x160.png" : "../../assets/Logo160x160.png";

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Image source={{ uri: logoUri }} style={styles.logo} />
        <Header />
        <VideoDataService />
      </View>
    </ScrollView>
  );
};
