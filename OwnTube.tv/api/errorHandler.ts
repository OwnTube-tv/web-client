import { AxiosError } from "axios";
import { OwnTubeError } from "./models";

export function handleAxiosErrorWithRetry(error: unknown, target: string): Promise<never> {
  const { message, response } = error as AxiosError;
  const retryAfter = response?.headers["retry-after"];

  if (retryAfter) {
    console.info(`Too many requests. Retrying to fetch ${target} in ${retryAfter} seconds...`);
  }

  return new Promise((_, reject) => {
    setTimeout(
      () => {
        reject(new OwnTubeError(`Failed to fetch ${target}. ${message}`, response?.status, message));
      },
      (retryAfter ?? 0) * 1000, // QueryClient will handle the retry
    );
  });
}
