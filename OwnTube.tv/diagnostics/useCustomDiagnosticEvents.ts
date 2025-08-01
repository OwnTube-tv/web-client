import { usePostHog } from "posthog-react-native/lib/posthog-react-native/src/hooks/usePostHog";
import { CustomPostHogEvents } from "./constants";
import { CustomPostHogEventParams } from "./models";

export const useCustomDiagnosticsEvents = () => {
  const posthog = usePostHog();

  const captureDiagnosticsEvent = (event: CustomPostHogEvents, properties?: CustomPostHogEventParams[typeof event]) => {
    posthog.capture(event, properties);
  };

  return {
    captureDiagnosticsEvent,
  };
};
