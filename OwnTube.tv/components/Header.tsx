import React from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import build_info from "../build-info.json";
import { colors, theme } from "../colors";

export const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>
        Open up <Text style={styles.boldText}>App.tsx</Text> to start working on your app, current deployed revision is{" "}
        <Text style={styles.link} onPress={() => Linking.openURL(build_info.COMMIT_URL)}>
          {build_info.GITHUB_SHA_SHORT}
        </Text>{" "}
        built at {build_info.BUILD_TIMESTAMP}.
      </Text>

      <Text style={styles.footnote}>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mainText: {
    fontSize: 16,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: 'bold',
  },
  link: {
    color: colors.blue,
    textDecorationLine: "underline",
  },
  footnote: {
    marginTop: 10,
    fontSize: 14,
  },
});
