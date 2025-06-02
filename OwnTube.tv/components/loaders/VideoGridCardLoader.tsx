import { StyleSheet, View } from "react-native";
import { Spacer } from "../shared/Spacer";
import { SkeletonLoader } from "./SkeletonLoader";

export const VideoGridCardLoader = () => {
  return (
    <View style={styles.container}>
      <SkeletonLoader containerStyle={styles.thumbnail} />
      <Spacer height={8} />
      <SkeletonLoader containerStyle={styles.line1} />
      <Spacer height={8} />
      <SkeletonLoader containerStyle={styles.line2} />
      <Spacer height={8} />
      <SkeletonLoader containerStyle={styles.line3} />
      <Spacer height={8} />
      <SkeletonLoader containerStyle={styles.line4} />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: { flex: 1, height: "100%", maxHeight: 314 },
  line1: {
    height: "8%",
    left: "2%",
    width: "95%",
  },
  line2: {
    height: "8%",
    left: "2%",
    width: "89%",
  },
  line3: {
    height: "4%",
    left: "2%",
    width: "39%",
  },
  line4: {
    height: "4%",
    left: "2%",
    width: "43%",
  },
  thumbnail: {
    height: "64%",
    width: "100%",
  },
});
