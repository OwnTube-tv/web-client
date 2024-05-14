import { Header, VideoList } from "../../components";
import { useThemedStyles } from "../../hooks";
import { Screen } from "../../layouts";
import { styles } from "./styles";

export const HomeScreen = () => {
  const style = useThemedStyles(styles);

  return (
    <Screen style={style.container}>
      <Header />
      <VideoList />
    </Screen>
  );
};
