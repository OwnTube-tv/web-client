import { LogoQuestionMarks } from "./Svg";
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";

interface EmptyPageProps {
  text: string;
}

export const EmptyPage = ({ text }: EmptyPageProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <LogoQuestionMarks />
      <Typography fontWeight="Medium" style={styles.text} color={colors.theme800}>
        {text}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  text: { fontSize: 18, textAlign: "center" },
});
