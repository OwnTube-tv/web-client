import { usePostHog } from "posthog-react-native/lib/posthog-react-native/src/hooks/usePostHog";
import { CustomPostHogEvents, CustomPostHogExceptions, DebugLevelCustomPostHogEvents } from "./constants";
import { CustomPostHogEventParams } from "./models";
import { useAppConfigContext } from "../contexts";

export const useCustomDiagnosticsEvents = () => {
  const posthog = usePostHog();
  const { isDebugMode } = useAppConfigContext();

  const captureDiagnosticsEvent = (event: CustomPostHogEvents, properties?: CustomPostHogEventParams[typeof event]) => {
    if (!isDebugMode && DebugLevelCustomPostHogEvents.includes(event)) {
      return;
    }

    posthog.capture(event, properties);
  };

  const captureError = (error: unknown, errorType: CustomPostHogExceptions) => {
    posthog.captureException(error, { errorType });
  };

  return {
    captureDiagnosticsEvent,
    captureError,
  };
};
