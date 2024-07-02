import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SOURCES, STORAGE } from "../types";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { writeToAsyncStorage } from "../utils";
import { RootStackParams } from "../app/_layout";
import { useGetInstancesQuery } from "../api";
import { ComboBoxInput } from "./ComboBoxInput";

export const SourceSelect = () => {
  const { backend } = useLocalSearchParams<RootStackParams["settings"]>();
  const router = useRouter();
  const { colors } = useTheme();

  const handleSelectSource = (backend: string) => {
    router.setParams({ backend });
    writeToAsyncStorage(STORAGE.DATASOURCE, backend);
  };

  const renderItem = useCallback(
    (item: string) => (
      <Typography
        key={item}
        style={styles.source}
        color={item === backend ? colors.primary : undefined}
        onPress={() => handleSelectSource(item)}
      >
        {item}
      </Typography>
    ),
    [backend, handleSelectSource],
  );

  const { data } = useGetInstancesQuery();

  const availableInstances = useMemo(() => {
    return data
      ?.filter(({ totalLocalVideos }) => totalLocalVideos > 0)
      .map(({ name, host, totalLocalVideos }) => ({
        label: `${name} (${totalLocalVideos})`,
        value: host,
      }));
  }, [data]);

  return (
    <View style={styles.container}>
      <Typography>Predefined instances:</Typography>
      {Object.values(SOURCES).map(renderItem)}
      {backend && backend in SOURCES && renderItem(backend)}
      <Typography>Selected instance: {backend}</Typography>
      <ComboBoxInput
        testID={"custom-instance-select"}
        value={backend}
        data={availableInstances}
        onChange={handleSelectSource}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  source: {
    opacity: 0.5,
    padding: 5,
  },
});
