import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    gap: 10,
    padding: 20,
  },
  deviceInfoAndToggles: { flexDirection: "row", flexWrap: "wrap", gap: 16, width: "100%" },
  option: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  togglesContainer: { flex: 1, minWidth: 200 },
});
