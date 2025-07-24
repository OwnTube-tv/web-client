import PostHog from "posthog-react-native";
import { Platform } from "react-native";
import { APP_IDENTIFIER } from "./api";

const DEFAULT_POSTHOG_API_KEY = "phc_tceJOYqTcTVPWvO9TmRBKtMS0Y2H6y6DtyVDAoC9hG4";

export const postHogInstance = new PostHog(process.env.EXPO_PUBLIC_POSTHOG_API_KEY || DEFAULT_POSTHOG_API_KEY, {
  host: process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
  persistence: Platform.OS === "web" ? "memory" : "file",
  disabled: process.env.EXPO_PUBLIC_POSTHOG_API_KEY === "null",
  customAppProperties: (properties) => ({
    ...properties,
    "X-App-Identifier": APP_IDENTIFIER,
  }),
});
