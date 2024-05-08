import { ScrollView, View } from "react-native";
import { Header, MainPageC } from "../../components";
import { styles } from "./styles";

export const HomeScreen = () => (
  <ScrollView>
    <View style={styles.container}>
      <Header />
      <MainPageC />
    </View>
  </ScrollView>
);
