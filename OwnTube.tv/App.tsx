import { SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppConfigContextProvider, VideoServiceContextProvider } from "./contexts";
import { Navigation } from "./navigation";
import React from "react";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AppConfigContextProvider>
        <VideoServiceContextProvider>
          <StatusBar style="auto" />
          <Navigation />
        </VideoServiceContextProvider>
      </AppConfigContextProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
