import { useEffect } from "react";
import { useCustomDiagnosticsEvents } from "../diagnostics/useCustomDiagnosticEvents";
import { CustomPostHogEvents, CustomPostHogExceptions } from "../diagnostics/constants";
import { AppState, Platform } from "react-native";
import { usePostHog } from "posthog-react-native";

export const useAppStateDiagnostics = () => {
  const { captureDiagnosticsEvent } = useCustomDiagnosticsEvents();
  const posthog = usePostHog();

  useEffect(() => {
    const handleFocus = () => {
      captureDiagnosticsEvent(CustomPostHogEvents.TabFocus, { tabUrl: window.location.href });
    };
    const handleBlur = () => {
      captureDiagnosticsEvent(CustomPostHogEvents.TabBlur, { tabUrl: window.location.href });
    };
    const appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        captureDiagnosticsEvent(CustomPostHogEvents.AppInForeground);
      }
      if (nextAppState === "background") {
        captureDiagnosticsEvent(CustomPostHogEvents.AppInBackground);
      }
    });
    const outOfMemorySubscription = AppState.addEventListener("memoryWarning", () => {
      posthog.captureException(CustomPostHogExceptions.OutOfMemory);
    });

    if (Platform.OS === "web") {
      window?.addEventListener("focus", handleFocus);
      window?.addEventListener("blur", handleBlur);
    }

    return () => {
      if (Platform.OS === "web") {
        window?.removeEventListener("focus", handleFocus);
        window?.removeEventListener("blur", handleBlur);
      }
      appStateSubscription.remove();
      outOfMemorySubscription?.remove();
    };
  }, []);
};
