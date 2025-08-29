import { useEffect, useRef, useState } from "react";
import { useCustomDiagnosticsEvents } from "../diagnostics/useCustomDiagnosticEvents";
import { CustomPostHogEvents } from "../diagnostics/constants";

export const useWatchedDuration = (totalDuration?: number) => {
  const watchedSecondsTimestamps = useRef(new Set());
  const [watchedDuration, setWatchedDuration] = useState(0);
  const { captureDiagnosticsEvent } = useCustomDiagnosticsEvents();

  const handleTimeUpdate = (currentTimeInt: number) => {
    if (!watchedSecondsTimestamps.current.has(currentTimeInt)) {
      watchedSecondsTimestamps.current.add(currentTimeInt);
      setWatchedDuration(watchedSecondsTimestamps.current.size);
    }
  };

  useEffect(() => {
    if (totalDuration && watchedDuration > 0) {
      const quarters = [0.25, 0.5, 0.75, 1];
      quarters.forEach((q) => {
        const threshold = Math.floor(totalDuration * q);
        if (watchedDuration === threshold || (watchedDuration > threshold && watchedDuration - 1 < threshold)) {
          captureDiagnosticsEvent(CustomPostHogEvents.VideoPercentageComplete, {
            percentageWatched: `${(q * 100).toFixed(0)}%`,
          });
        }
      });
    }
  }, [watchedDuration]);

  return { watchedSecondsTimestamps, watchedDuration, setWatchedDuration, handleTimeUpdate };
};
