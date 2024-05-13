import { SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppConfigContextProvider, VideoServiceContextProvider } from "./contexts";
import { Navigation } from "./navigation";
import { ColorSchemeContextProvider } from "./contexts";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AppConfigContextProvider>
        <VideoServiceContextProvider>
          <ColorSchemeContextProvider>
            <StatusBar style="auto" />
            <Navigation />
          </ColorSchemeContextProvider>
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
