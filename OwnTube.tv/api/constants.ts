import { VideosCommonQuery } from "@peertube/peertube-types";

// Common query parameters for fetching videos that are classified as "local", "non-live", and "Safe-For-Work"
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
  instanceServerConfig = "instanceServerConfig",
  channel = "channel",
  channels = "channels",
  channelsCollection = "channelsCollection",
  channelVideos = "channelVideos",
  channelPlaylists = "channelPlaylists",
  categories = "categories",
  categoriesCollection = "categoriesCollection",
  playlists = "playlists",
  playlistVideos = "playlistVideos",
  playlistInfo = "playlistInfo",
  playlistsCollection = "playlistsCollection",
  videoCaptions = "videoCaptions",
  liveVideos = "liveVideos",
  liveStreamsCollection = "liveStreamsCollection",
  homepageLatestVideosView = "homepageLatestVideosView",
  categoryVideosView = "categoryVideosView",
  channelLatestVideosView = "channelLatestVideosView",
  premiumAdsCollection = "premiumAdsCollection",
  premiumAdsCaptionsCollection = "premiumAdsCaptionsCollection",
}

export const WRONG_SERVER_VERSION_STATUS_CODE = 444;

export const GLOBAL_QUERY_STALE_TIME = 3_600_000; // 1 hour in ms
