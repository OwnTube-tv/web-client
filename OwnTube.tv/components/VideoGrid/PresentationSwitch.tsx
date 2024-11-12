import { Button } from "../shared";
import { StyleSheet, View } from "react-native";
import { spacing } from "../../theme";
import { useTheme } from "@react-navigation/native";

interface PresentationSwitchProps {
  presentation?: "list" | "grid";
  handleSetPresentation: (presentation: "list" | "grid") => void;
}

export const PresentationSwitch = ({ presentation, handleSetPresentation }: PresentationSwitchProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.presentationSwitcherContainer,
        {
          backgroundColor: colors.theme100,
          borderColor: colors.theme100,
        },
      ]}
    >
      <Button
        style={styles.presentationSwitcherButton}
        onPress={() => handleSetPresentation("list")}
        icon="List"
        contrast={presentation === "list" ? "high" : "low"}
      />
      <Button
        style={styles.presentationSwitcherButton}
        onPress={() => handleSetPresentation("grid")}
        icon="Grid"
        contrast={presentation === "grid" ? "high" : "low"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  presentationSwitcherButton: { height: 36, paddingVertical: 6 },
  presentationSwitcherContainer: {
    alignSelf: "flex-start",
    borderRadius: 12,
    borderWidth: spacing.xs,
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.xl,
    overflow: "hidden",
  },
});
