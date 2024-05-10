import { SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppConfigContextProvider, VideoServiceContextProvider } from "./contexts";
import { Navigation } from "./navigation";
import ThemeProvider from "./src/theme/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaView style={styles.container}>
        <AppConfigContextProvider>
          <VideoServiceContextProvider>
            <StatusBar style="auto" />
            <Navigation />
          </VideoServiceContextProvider>
        </AppConfigContextProvider>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
