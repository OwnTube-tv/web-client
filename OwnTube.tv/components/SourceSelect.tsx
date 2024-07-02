import { useCallback, useMemo } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { SOURCES, STORAGE } from "../types";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { writeToAsyncStorage } from "../utils";
import { RootStackParams } from "../app/_layout";
import { useGetInstancesQuery } from "../api";
import { ComboBoxInput } from "./ComboBoxInput";
import { Spacer } from "./shared/Spacer";
import { colors } from "../colors";

export const SourceSelect = () => {
  const { backend } = useLocalSearchParams<RootStackParams["settings"]>();
  const router = useRouter();
  const theme = useTheme();

  const handleSelectSource = (backend: string) => {
    router.setParams({ backend });
    writeToAsyncStorage(STORAGE.DATASOURCE, backend);
  };

  const renderItem = useCallback(
    (item: string) => (
      <Typography
        key={item}
        style={styles.source}
        color={item === backend ? theme.colors.primary : undefined}
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
        label: `${host} - ${name} (${totalLocalVideos})`,
        value: host,
      }));
  }, [data]);

  return (
    <View style={styles.container}>
      {backend && (
        <View style={{ flexDirection: "row" }}>
          <Typography>Selected instance: </Typography>
          <Pressable onPress={() => Linking.openURL(`https://${backend}/`)}>
            <Typography color={theme.colors.primary}>{backend}</Typography>
          </Pressable>
        </View>
      )}
      <Spacer height={16} />
      <Typography>Predefined instances:</Typography>
      {Object.values(SOURCES).map(renderItem)}
      {backend && backend in SOURCES && renderItem(backend)}
      <Spacer height={16} />
      <Typography>
        <Link style={{ textDecorationLine: "underline", color: colors.sepia }} href={"https://sepiasearch.org/"}>
          Sepia
        </Link>{" "}
        PeerTube instances:
      </Typography>
      <Spacer height={16} />
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
