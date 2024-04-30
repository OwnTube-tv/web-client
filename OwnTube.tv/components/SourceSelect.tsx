import { useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "../colors";
import { useAppConfigContext } from "../contexts";
import { SOURCES } from "../types";

export const SourceSelect = () => {
  const { source, switchSource } = useAppConfigContext();

  const renderItem = useCallback(
    (item: SOURCES) => (
      <Text
        key={item}
        style={StyleSheet.flatten([styles.source, item === source ? styles.sourceActive : {}])}
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

const styles = StyleSheet.create({
  list: {},
  source: {
    backgroundColor: colors.ghostwhite,
    padding: 5,
  },
  sourceActive: {
    backgroundColor: colors.gainsboro,
  },
});
