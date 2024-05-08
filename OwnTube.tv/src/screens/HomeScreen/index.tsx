import { ScrollView, View, Switch } from "react-native";
import { Header, VideoDataService } from "../../../components";
import { styles } from "./styles";
import useTheme from "../../theme/useTheme";
import useThemedStyles from "../../theme/useThemedStyles";

export const HomeScreen = () => {
  const style = useThemedStyles(styles);

  return (
    <ScrollView>
      <View style={style.container}>
        <Header />
        <VideoDataService />
      </View>
    </ScrollView>
  );
};
