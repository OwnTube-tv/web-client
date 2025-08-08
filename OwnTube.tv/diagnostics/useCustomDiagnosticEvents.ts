import { usePostHog } from "posthog-react-native/lib/posthog-react-native/src/hooks/usePostHog";
import { CustomPostHogEvents, CustomPostHogExceptions } from "./constants";
import { CustomPostHogEventParams } from "./models";

export const useCustomDiagnosticsEvents = () => {
  const posthog = usePostHog();

  const captureDiagnosticsEvent = (event: CustomPostHogEvents, properties?: CustomPostHogEventParams[typeof event]) => {
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
