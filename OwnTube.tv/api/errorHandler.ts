import { AxiosError } from "axios";
import { OwnTubeError } from "./models";
import { postHogInstance } from "../diagnostics";
import { CustomPostHogExceptions } from "../diagnostics/constants";

export function handleAxiosErrorWithRetry(error: unknown, target: string): Promise<never> {
  const { message, response } = error as AxiosError;
  const retryAfter = response?.headers["retry-after"];
  postHogInstance.captureException(error, { errorType: `${CustomPostHogExceptions.HttpRequestError} (${target})` });

  if (retryAfter) {
    console.info(`Too many requests. Retrying to fetch ${target} in ${retryAfter} seconds...`);
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
