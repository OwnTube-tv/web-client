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

export enum QUERY_KEYS {
  videos = "videos",
  video = "video",
  instances = "instances",
  instance = "instance",
  channel = "channel",
  channels = "channels",
  channelVideos = "channelVideos",
  categories = "categories",
  playlists = "playlists",
  playlistVideos = "playlistVideos",
}
