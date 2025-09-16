import { VideosSearchQuery } from "@peertube/peertube-types";
import buildInfo from "../build-info.json";

export const APP_IDENTIFIER = `${buildInfo.GITHUB_REPOSITORY}@${buildInfo.GITHUB_SHA_SHORT} (https://github.com/${buildInfo.GITHUB_ACTOR})`;

export const SEARCH_DEFAULTS: VideosSearchQuery = {
  isLocal: true,
  count: 15,
  sort: "-match",
};
