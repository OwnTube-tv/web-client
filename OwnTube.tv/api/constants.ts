// Common query parameters for fetching videos that are classified as "local", "non-live", and "Safe-For-Work"
import { VideosCommonQuery } from "@peertube/peertube-types";

export const commonQueryParams: VideosCommonQuery = {
  start: 0,
  count: 15,
  sort: "createdAt",
  nsfw: "false",
  isLocal: true,
  isLive: false,
  skipCount: false,
};
