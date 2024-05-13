import { StyleSheet, View, Linking } from "react-native";
import build_info from "../build-info.json";
import { useTheme } from "@react-navigation/native";
import { Typography } from "./Typography";

export const Header = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Typography>
        Open up App.tsx to start working on your app, current deployed revision is{" "}
        <Typography color={theme.colors.primary} onPress={() => Linking.openURL(build_info.COMMIT_URL)}>
          {build_info.GITHUB_SHA_SHORT}
        </Typography>{" "}
        built at {build_info.BUILD_TIMESTAMP}.
      </Typography>

      <Typography>
        (Your friendly{" "}
        <Typography
          color={theme.colors.primary}
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
  container: {
    borderBottomWidth: 1,
    gap: 10,
    marginVertical: 10,
    padding: 10,
  },
});
