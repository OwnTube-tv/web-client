import { View, Pressable } from "react-native";
import { SourceSelect, Typography, ViewHistory, AppConfig } from "../../components";
import { Screen } from "../../layouts";
import { styles } from "./styles";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";

type SettingsTab = "history" | "instance" | "config";

const tabsWithNames: Record<SettingsTab, string> = {
  history: "History",
  instance: "Instance",
  config: "Config",
};

export const SettingsScreen = () => {
  const { colors } = useTheme();
  const { tab } = useLocalSearchParams<RootStackParams[ROUTES.SETTINGS]>();
  const router = useRouter();

  const tabContent: Record<SettingsTab, React.JSX.Element> = {
    history: <ViewHistory />,
    instance: <SourceSelect />,
    config: <AppConfig />,
  };

  const setTab = (newTab: SettingsTab) => () => {
    router.setParams({ tab: newTab });
  };

  return (
    <Screen style={{ ...styles.container, backgroundColor: colors.background }}>
      <View
        style={[
          {
            borderColor: colors.primary,
          },
          styles.tabsContainer,
        ]}
      >
        {Object.entries(tabsWithNames).map(([key, label]) => (
          <Pressable key={key} onPress={setTab(key as SettingsTab)}>
            <Typography color={key === tab ? colors.primary : undefined}>{label}</Typography>
          </Pressable>
        ))}
      </View>
      {!!tab && tabContent[tab]}
    </Screen>
  );
};
