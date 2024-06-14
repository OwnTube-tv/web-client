import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { SOURCES, STORAGE } from "../types";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { writeToAsyncStorage } from "../utils";
import { RootStackParams } from "../app/_layout";

export const SourceSelect = () => {
  const { backend } = useLocalSearchParams<RootStackParams["settings"]>();
  const router = useRouter();
  const { colors } = useTheme();

  const handleSelectSource = (backend: string) => () => {
    router.setParams({ backend });
    writeToAsyncStorage(STORAGE.DATASOURCE, backend);
  };

  const renderItem = useCallback(
    (item: string) => (
      <Typography
        key={item}
        style={styles.source}
        color={item === backend ? colors.primary : undefined}
        onPress={handleSelectSource(item)}
      >
        {item}
      </Typography>
    ),
    [backend, handleSelectSource],
  );

  return (
    <View>
      <Typography>Select source:</Typography>
      {Object.values(SOURCES).map(renderItem)}
      {backend && backend in SOURCES && renderItem(backend)}
    </View>
  );
};

const styles = StyleSheet.create({
  source: {
    opacity: 0.5,
    padding: 5,
  },
});
