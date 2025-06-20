import { VideoChannelSummary, Video, UserLogin, OAuthClientLocal } from "@peertube/peertube-types";

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
  | "uuid"
  | "name"
  | "description"
  | "duration"
  | "publishedAt"
  | "originallyPublishedAt"
  | "views"
  | "isLive"
  | "viewers"
  | "state"
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
  description: string;
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
  constructor({ text, code, message, status }: { text?: string; code?: string; message: string; status?: number }) {
    this.text = text || "Unexpected";
    this.code = code;
    this.message = message;
    this.status = status;
  }
  public text: string;
  public code?: string;
  public message: string;
  public status?: number;
}

export type UserLoginResponse = UserLogin & { expires_in: number; refresh_token_expires_in: number };

export enum ServerErrorCodes {
  MISSING_TWO_FACTOR = "missing_two_factor",
}

export type LoginRequestArgs = {
  loginPrerequisites: OAuthClientLocal;
  username: string;
  password: string;
  otp?: string;
};
