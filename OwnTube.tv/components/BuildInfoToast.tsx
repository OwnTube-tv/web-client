import { Linking, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import build_info from "../build-info.json";
import { useTheme } from "@react-navigation/native";

export const BuildInfoToast = () => {
  const { colors } = useTheme();

  return (
    <View style={[{ backgroundColor: colors.card }, styles.container]}>
      <Typography fontSize={14} style={{ userSelect: "none" }}>
        Revision{" "}
        <Typography fontSize={14} style={styles.link} onPress={() => Linking.openURL(build_info.COMMIT_URL)}>
          {build_info.GITHUB_SHA_SHORT}
        </Typography>{" "}
        built at {`${build_info.BUILD_TIMESTAMP.slice(0, build_info.BUILD_TIMESTAMP.lastIndexOf(":"))}Z`} by{" "}
        <Typography
          fontSize={14}
          style={styles.link}
          onPress={() => Linking.openURL("https://github.com/" + build_info.GITHUB_ACTOR)}
        >
          {build_info.GITHUB_ACTOR}
        </Typography>
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
  },
  link: {
    textDecorationLine: "underline",
  },
});
