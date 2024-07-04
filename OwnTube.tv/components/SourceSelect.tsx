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
import { Spacer } from "./shared/Spacer";
import { colors } from "../colors";
import { useRecentInstances } from "../hooks";
import { Ionicons } from "@expo/vector-icons";
import { ExternalLink } from "./ExternalLink";

export const SourceSelect = () => {
  const { backend } = useLocalSearchParams<RootStackParams["settings"]>();
  const router = useRouter();
  const theme = useTheme();
  const { recentInstances, addRecentInstance, clearRecentInstances } = useRecentInstances();

  const handleSelectSource = (backend: string) => {
    router.setParams({ backend });
    writeToAsyncStorage(STORAGE.DATASOURCE, backend);
    addRecentInstance(backend);
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
          <ExternalLink absoluteHref={`https://${backend}/`}>
            <Typography color={theme.colors.primary}>{backend}</Typography>
          </ExternalLink>
        </View>
      )}
      <Spacer height={16} />
      {!!recentInstances?.length && (
        <>
          <View style={styles.recentsHeader}>
            <Typography>Recent instances:</Typography>
            <Ionicons.Button
              name="trash"
              backgroundColor={theme.colors.background}
              style={{ ...styles.iconButton, borderColor: theme.colors.border }}
              onPress={clearRecentInstances}
            >
              <Typography>Clear</Typography>
            </Ionicons.Button>
          </View>
          {recentInstances?.map(renderItem)}
          <Spacer height={16} />
        </>
      )}
      <Typography>Predefined instances:</Typography>
      {Object.values(SOURCES).map(renderItem)}
      {backend && backend in SOURCES && renderItem(backend)}
      <Spacer height={16} />
      <Typography>
        <ExternalLink absoluteHref={"https://sepiasearch.org/"}>
          <Typography color={colors.sepia}>Sepia</Typography>
        </ExternalLink>{" "}
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
  iconButton: { borderWidth: 1 },
  recentsHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  source: {
    opacity: 0.5,
    padding: 5,
  },
});
