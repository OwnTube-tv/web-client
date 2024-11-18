import { StyleSheet } from "react-native";
import { borderRadius, fontSizes } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: borderRadius.radiusMd,
    borderWidth: 1,
    flexDirection: "row",
    height: 48,
    position: "relative",
    zIndex: 1,
  },
  input: {
    borderRadius: borderRadius.radiusMd,
    fontSize: fontSizes.sizeSm,
    fontWeight: "500",
    height: "100%",
    paddingLeft: 16,
    width: "100%",
  },
  optionsContainer: {
    borderRadius: borderRadius.radiusMd,
    borderWidth: 1,
    flex: 1,
    left: 0,
    maxHeight: 288,
    position: "absolute",
    top: 56,
    zIndex: 999,
  },
  optionsList: {
    borderRadius: borderRadius.radiusMd,
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
});
