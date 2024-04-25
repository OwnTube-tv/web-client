import { ScrollView, View } from "react-native";
import { Header, VideoDataService } from "../../components";
import { styles } from "./styles";

export const HomeScreen = () => (
  <ScrollView>
    <View style={styles.container}>
      <Header />
      <VideoDataService />
    </View>
  </ScrollView>
);
