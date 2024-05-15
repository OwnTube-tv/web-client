import { StatusBar } from "expo-status-bar";
import { AppConfigContextProvider, VideoServiceContextProvider, ThemeProvider } from "./contexts";
import { SafeAreaWrapper } from "./layouts";
import { Navigation } from "./navigation";

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaWrapper>
        <AppConfigContextProvider>
          <VideoServiceContextProvider>
            <StatusBar style="auto" />
            <Navigation />
          </VideoServiceContextProvider>
        </AppConfigContextProvider>
      </SafeAreaWrapper>
    </ThemeProvider>
  );
}
