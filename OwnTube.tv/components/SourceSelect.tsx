import { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useAppConfigContext } from "../contexts";
import { SOURCES } from "../types";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";

export const SourceSelect = () => {
  const { source, switchSource } = useAppConfigContext();
  const theme = useTheme();

  const renderItem = useCallback(
    (item: SOURCES) => {
      const isSelected = item === source;

      return (
        <Typography
          key={item}
          style={styles.source}
          color={isSelected ? theme.colors.primary : undefined}
          onPress={() => switchSource(item)}
        >
          {item}
        </Typography>
      );
    },
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
    padding: 5,
  },
});
