import { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useAppConfigContext } from "../contexts";
import { SOURCES } from "../types";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";

export const SourceSelect = () => {
  const { source, switchSource } = useAppConfigContext();
  const { colors } = useTheme();

  const renderItem = useCallback(
    (item: SOURCES) => (
      <Typography
        key={item}
        style={styles.source}
        color={item === source ? colors.primary : undefined}
        onPress={() => switchSource(item)}
      >
        {item}
      </Typography>
    ),
    [source],
  );

  return (
    <View>
      <Typography>Select source:</Typography>
      {Object.values(SOURCES).map(renderItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  source: {
    opacity: 0.5,
    padding: 5,
  },
});
