import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Switch } from "react-native";
import { useContext, useState } from "react";
import VideoDataService from "../components/videosOverview";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../theme/themeContext";
import build_info from "../build-info.json";

const Home = () => {
  const [darkmode, setDarkMode] = useState(false);
  const theme = useContext(themeContext);
  const textColor = {
    color: theme.color,
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Using the SVG component */}
      <Image source={theme.image} />
      <Text style={textColor}>
        Open up App.tsx to start working on your app, current deployed revision is{" "}
        <a href={build_info.COMMIT_URL} target="_blank" rel="noreferrer">
          {build_info.GITHUB_SHA_SHORT}
        </a>{" "}
        built at {build_info.BUILD_TIMESTAMP}.
      </Text>
      <hr></hr>
      <Text style={textColor}>
        (Your friendly{" "}
        <a href={"https://github.com/" + build_info.GITHUB_ACTOR} target="_blank" rel="noreferrer">
          <code>{build_info.GITHUB_ACTOR}</code>
        </a>{" "}
        🙋‍♀️ was here!)
      </Text>
      <Switch
        value={darkmode}
        onValueChange={(value) => {
          setDarkMode(value);
          EventRegister.emit("ChangeTheme", value);
        }}
      />
      <StatusBar style="auto" />
      <VideoDataService />
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    overflow: "scroll",
  },
});
