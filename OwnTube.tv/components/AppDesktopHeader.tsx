import { Platform, StyleSheet } from "react-native";
import { spacing } from "../theme";
import { Button } from "./shared";
import { useShareButton } from "../hooks";
import TVFocusGuideHelper from "./helpers/TVFocusGuideHelper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const AppDesktopHeader = () => {
  const { handleToggleShareModal } = useShareButton();
  const { top } = useSafeAreaInsets();

  return (
    <TVFocusGuideHelper
      autoFocus
      style={Platform.isTV ? styles.tvContainer : styles.container}
      pointerEvents="box-none"
    >
      <Button
        onPress={() => handleToggleShareModal({})}
        contrast="low"
        style={{ ...styles.button, marginTop: top + (Platform.isTV ? spacing.sm : 0) }}
        icon="Share"
      />
    </TVFocusGuideHelper>
  );
};

const styles = StyleSheet.create({
  button: { alignSelf: "flex-end", height: 48, marginRight: spacing.xl, paddingVertical: 6 },
  container: {
    height: 60,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xl,
    position: "absolute",
    top: 0,
    width: "100%",
  },
  tvContainer: {
    height: spacing.xs,
    paddingRight: spacing.xs,
    position: "relative",
    zIndex: 1,
  },
});
