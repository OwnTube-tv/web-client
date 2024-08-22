// Subset of a video object from the PeerTube backend API, https://github.com/Chocobozzz/PeerTube/blob/develop/server/core/models/video/video.ts#L460
import { VideoModel } from "@peertube/peertube-types/server/core/models/video/video";
import { VideoChannelSummary } from "@peertube/peertube-types";

export interface Channel {
  id: number;
  name: string;
  displayName: string;
  url: string;
  host: string;
  avatars: Array<{
    width: number;
    path: string;
    createdAt: string;
    updatedAt: string;
  }>;
  avatar: {
    width: number;
    path: string;
    createdAt: string;
    updatedAt: string;
  };
}

export type GetVideosVideo = Pick<
  VideoModel,
  "uuid" | "name" | "description" | "duration" | "publishedAt" | "originallyPublishedAt" | "views"
> & {
  thumbnailPath: string;
  category: { id: number | null; label: string };
  channel: VideoChannelSummary;
};

export type PeertubeInstance = {
  id: number;
  host: string;
  name: string;
  shortDescription: string;
  version: string;
  signupAllowed: boolean;
  signupRequiresApproval: boolean;
  userVideoQuota: number;
  liveEnabled: boolean;
  categories: number[];
  languages: string[];
  autoBlacklistUserVideosEnabled: boolean;
  defaultNSFWPolicy: "do_not_list" | "display" | "blur";
  isNSFW: boolean;
  avatars: Array<{ width: number; url: string; path: string }>;
  banners: Array<{ width: number; url: string; path: string }>;
  totalUsers: number;
  totalVideos: number;
  totalLocalVideos: number;
  totalInstanceFollowers: number;
  totalInstanceFollowing: number;
  supportsIPv6: boolean;
  country: string;
  health: number;
  createdAt: number;
};
