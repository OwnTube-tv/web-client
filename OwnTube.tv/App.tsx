import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import VideoDataService from "./components/videosOverview";

import build_info from "./build-info.json";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>
        Open up App.tsx to start working on your app, current deployed revision is{" "}
        <a href={build_info.COMMIT_URL} target="_blank" rel="noreferrer">
          {build_info.GITHUB_SHA_SHORT}
        </a>{" "}
        built at {build_info.BUILD_TIMESTAMP}.
      </Text>
      <hr></hr>
      <Text>
        (Your friendly{" "}
        <a href={"https://github.com/" + build_info.GITHUB_ACTOR} target="_blank" rel="noreferrer">
          <code>{build_info.GITHUB_ACTOR}</code>
        </a>{" "}
        🙋‍♀️ was here!)
      </Text>
      <StatusBar style="auto" />
      <VideoDataService></VideoDataService>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    overflow: "scroll",
  },
});
