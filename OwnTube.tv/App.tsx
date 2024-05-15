import { StatusBar } from "expo-status-bar";
import { AppConfigContextProvider, VideoServiceContextProvider } from "./contexts";
import { SafeAreaWrapper } from "./layouts";
import { Navigation } from "./navigation";
import { ColorSchemeContextProvider } from "./contexts";

export default function App() {
  return (
    <SafeAreaWrapper>
      <AppConfigContextProvider>
        <VideoServiceContextProvider>
          <ColorSchemeContextProvider>
            <StatusBar style="auto" />
            <Navigation />
          </ColorSchemeContextProvider>
        </VideoServiceContextProvider>
      </AppConfigContextProvider>
    </SafeAreaWrapper>
  );
}
