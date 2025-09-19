import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button } from "./shared";
import { Spacer } from "./shared/Spacer";
import { spacing } from "../theme";

interface ErrorPageProps {
  title: string;
  description?: string;
  logo: JSX.Element;
  button: { action: () => void; text: string };
}

export const ErrorPage = ({ title, description, logo, button }: ErrorPageProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {logo}
      <Spacer height={12} />
      <Typography fontWeight="Medium" style={styles.title} color={colors.theme800}>
        {title}
      </Typography>
      <Spacer height={spacing.xl} />
      {description && (
        <Typography numberOfLines={12} fontSize="sizeSm" fontWeight="Medium" color={colors.themeDesaturated500}>
          {description}
        </Typography>
      )}
      <Spacer height={spacing.xl} />
      <Button text={button.text} onPress={button.action} contrast="high" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: { fontSize: 18 },
});
