import { Typography } from "./Typography";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

interface IconButtonProps {
  onPress: () => void;
  text: string;
  icon: string;
}

export const IconButton = ({ onPress, icon, text }: IconButtonProps) => {
  const { colors } = useTheme();

  return (
    <Ionicons.Button
      // @ts-expect-error there is no usable type for this property provided in the lib
      name={icon}
      backgroundColor={colors.background}
      style={{ ...styles.container, borderColor: colors.border }}
      onPress={onPress}
    >
      <Typography>{text}</Typography>
    </Ionicons.Button>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    borderWidth: 1,
  },
});
