import { StyleSheet, Text, View, Linking } from "react-native";
import build_info from "../build-info.json";
import { colors } from "../colors";

export const Header = () => {
  return (
    <View style={styles.container}>
      <Text>
        Open up App.tsx to start working on your app, current deployed revision is{" "}
        <Text style={styles.link} onPress={() => Linking.openURL(build_info.COMMIT_URL)}>
          {build_info.GITHUB_SHA_SHORT}
        </Text>{" "}
        built at {build_info.BUILD_TIMESTAMP}.
      </Text>

      <Text>
        (Your friendly{" "}
        <Text style={styles.link} onPress={() => Linking.openURL("https://github.com/" + build_info.GITHUB_ACTOR)}>
          {build_info.GITHUB_ACTOR}
        </Text>{" "}
        🙋‍♀️ was here!)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    gap: 10,
    marginVertical: 10,
    padding: 10,
  },
  link: {
    color: colors.blue,
  },
});
