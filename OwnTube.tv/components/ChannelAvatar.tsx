import { Image, StyleSheet, View } from "react-native";
import { LogoNoText } from "./Svg";
import { useTheme } from "@react-navigation/native";

export const ChannelAvatar = ({ imageUri }: { imageUri?: string }) => {
  const { colors } = useTheme();

  return (
    <View>
      <LogoNoText width={72} height={72} fill={colors.text} stroke={colors.text} />
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={imageUri ? { uri: imageUri } : undefined} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: { height: 24, position: "relative", top: -1, width: 24 },
  imageContainer: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
