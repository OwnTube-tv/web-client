import PostHog from "posthog-react-native";
import { Platform } from "react-native";
import build_info from "./build-info.json";

const DEFAULT_POSTHOG_API_KEY = "phc_tceJOYqTcTVPWvO9TmRBKtMS0Y2H6y6DtyVDAoC9hG4";

export const postHogInstance = new PostHog(process.env.EXPO_PUBLIC_ANALYTICS_API_KEY || DEFAULT_POSTHOG_API_KEY, {
  host: process.env.EXPO_PUBLIC_ANALYTICS_HOST || "https://eu.i.posthog.com",
  persistence: Platform.OS === "web" ? "memory" : "file",
  disabled: process.env.EXPO_PUBLIC_ANALYTICS_API_KEY === "null",
  customAppProperties: (properties) => ({
    ...properties,
    "X-App-Identifier": `OwnTube-tv/web-client@${build_info.GITHUB_SHA_SHORT} (https://github.com/${build_info.GITHUB_ACTOR})`,
  }),
});
