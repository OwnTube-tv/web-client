import { StyleSheet, View, Linking } from "react-native";
import build_info from "../build-info.json";
import { Typography } from "./Typography";

export const Header = () => {
  return (
    <View style={styles.container}>
      <Typography style={styles.mainText}>
        Open up <Typography style={styles.boldText}>App.tsx</Typography> to start working on your app, current deployed
        revision is{" "}
        <Typography style={styles.link} onPress={() => Linking.openURL(build_info.COMMIT_URL)}>
          {build_info.GITHUB_SHA_SHORT}
        </Typography>{" "}
        built at {build_info.BUILD_TIMESTAMP}.
      </Typography>

      <Typography style={styles.footnote}>
        (Your friendly{" "}
        <Typography
          style={styles.link}
          onPress={() => Linking.openURL("https://github.com/" + build_info.GITHUB_ACTOR)}
        >
          {build_info.GITHUB_ACTOR}
        </Typography>{" "}
        🙋‍♀️ was here!)
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontWeight: "bold",
  },
  container: {
    borderBottomWidth: 1,

    elevation: 2,
  },
  footnote: {
    fontSize: 14,
    marginTop: 10,
  },
  link: {
    textDecorationLine: "underline",
  },
  mainText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
