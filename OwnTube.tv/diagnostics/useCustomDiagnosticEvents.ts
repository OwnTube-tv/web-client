import { usePostHog } from "posthog-react-native/lib/posthog-react-native/src/hooks/usePostHog";
import { CustomPostHogEvents, CustomPostHogExceptions, DebugLevelCustomPostHogEvents } from "./constants";
import type { CustomPostHogEventParams } from "./models";
import { useAppConfigContext } from "../contexts";

export const useCustomDiagnosticsEvents = () => {
  const posthog = usePostHog();
  const { isDebugMode } = useAppConfigContext();

  const captureDiagnosticsEvent = <E extends CustomPostHogEvents>(
    event: E,
    properties?: CustomPostHogEventParams[E],
  ): void => {
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
