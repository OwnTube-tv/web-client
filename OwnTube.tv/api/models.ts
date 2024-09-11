import { VideoChannelSummary } from "@peertube/peertube-types";
import { Video } from "@peertube/peertube-types/peertube-models/videos/video.model";

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
  Video,
  "uuid" | "name" | "description" | "duration" | "publishedAt" | "originallyPublishedAt" | "views"
> & {
  previewPath: string;
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

export class OwnTubeError {
  constructor(text: string = "Unexpected", code: number = 0, message: string) {
    this.text = text;
    this.code = code;
    this.message = message;
  }
  public text: string;
  public code: number;
  public message: string;
}
