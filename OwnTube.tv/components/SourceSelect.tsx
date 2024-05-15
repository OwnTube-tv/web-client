import { useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useAppConfigContext } from "../contexts";
import { useThemedStyles } from "../hooks";
import { SOURCES, Theme } from "../types";

export const SourceSelect = () => {
  const { source, switchSource } = useAppConfigContext();
  const styles = useThemedStyles(style);

  const renderItem = useCallback(
    (item: SOURCES) => (
      <Text
        key={item}
        style={[styles.source, item === source ? styles.sourceActive : {}]}
        onPress={() => switchSource(item)}
      >
        {item}
      </Text>
    ),
    [source],
  );

  return (
    <View style={styles.list}>
      <Text>Select source:</Text>
      {Object.values(SOURCES).map(renderItem)}
    </View>
  );
};

export const style = (theme: Theme) => {
  const styles = StyleSheet.create({
    source: {
      color: theme.colors.TEXT_SECONDARY,
      opacity: 0.5,
      padding: 5,
    },
    sourceActive: {
      color: theme.colors.TEXT,
      opacity: 1,
    },
  });
  return styles;
};
