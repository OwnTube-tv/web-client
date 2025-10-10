import { AxiosError } from "axios";
import { OwnTubeError } from "./models";
import { postHogInstance } from "../diagnostics";
import { CustomPostHogExceptions } from "../diagnostics/constants";
import { parseAxiosErrorDiagnosticsData } from "./helpers";

export function handleAxiosErrorWithRetry(error: unknown, target: string): Promise<never> {
  const { message, response } = error as AxiosError;
  const retryAfter = response?.headers["retry-after"];

  if (retryAfter) {
    console.info(`Too many requests. Retrying to fetch ${target} in ${retryAfter} seconds...`);
    postHogInstance.captureException(error, {
      errorType: `${CustomPostHogExceptions.RateLimitError} (${target})`,
      originalError: parseAxiosErrorDiagnosticsData(error as AxiosError),
    });
  } else {
    postHogInstance.captureException(error, {
      errorType: `${CustomPostHogExceptions.HttpRequestError} (${target})`,
      originalError: parseAxiosErrorDiagnosticsData(error as AxiosError),
    });
  }

  return new Promise((_, reject) => {
    setTimeout(
      () => {
        reject(
          new OwnTubeError({
            text: `Failed to fetch ${target}. ${message}`,
            status: response?.status,
            code: (response?.data as { code: string })?.code,
            message,
          }),
        );
      },
      (retryAfter ?? 0) * 1000, // QueryClient will handle the retry
    );
  });
}
