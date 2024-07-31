import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { Pressable, StyleSheet } from "react-native";
import { IcoMoonIcon } from "./IcoMoonIcon";

interface IconButtonProps {
  onPress: () => void;
  text: string;
  icon: string;
}

export const IconButton = ({ onPress, icon, text }: IconButtonProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      style={{ ...styles.container, borderColor: colors.border, backgroundColor: colors.background }}
      onPress={onPress}
    >
      <Typography>{text}</Typography>
      <IcoMoonIcon name={icon} size={24} color={colors.text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 16,
    padding: 8,
  },
});
