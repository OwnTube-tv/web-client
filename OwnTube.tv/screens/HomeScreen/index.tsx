import { ScrollView, View } from "react-native";
import { Header, VideoListComponent } from "../../components";
import { styles } from "./styles";

export const HomeScreen = () => (
  <ScrollView>
    <View style={styles.container}>
      <Header />
      <VideoListComponent />
    </View>
  </ScrollView>
);
