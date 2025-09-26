import { VideoChannel, VideoPlaylist, VideosCommonQuery, Video } from "@peertube/peertube-types";
import { GetVideosVideo } from "./models";
import { AxiosInstanceBasedApi } from "./axiosInstance";
import { commonQueryParams } from "./constants";
import { handleAxiosErrorWithRetry } from "./errorHandler";

/**
 * Get channels from the PeerTube backend `/api/v1/video-channels` API
 *
 * @description https://docs.joinpeertube.org/api-rest-reference.html#tag/Video-Channels/operation/getVideoChannels
 */
export class ChannelsApi extends AxiosInstanceBasedApi {
  constructor() {
    super();
  }

  /**
   * Get channel info
   *
   * @param [baseURL] - Selected instance url
   * @param [channelHandle] - Channel identifier
   * @returns Channel info
   */
  async getChannelInfo(baseURL: string, channelHandle: string): Promise<VideoChannel> {
    try {
      const response = await this.instance.get<VideoChannel>(`video-channels/${channelHandle}`, {
        baseURL: `https://${baseURL}/api/v1`,
      });

      return response.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "channel info");
    }
  }

  /**
   * Get a list of channels from the PeerTube instance
   *
   * @param [baseURL] - Selected instance url
   * @returns List of channels
   */
  async getChannels(baseURL: string): Promise<{ data: VideoChannel[]; total: number }> {
    try {
      const response = await this.instance.get<{ data: VideoChannel[]; total: number }>("video-channels", {
        params: { sort: "-createdAt", count: 30 },
        baseURL: `https://${baseURL}/api/v1`,
      });

      return response.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "channels");
    }
  }

  /**
   * Get a list of videos on an instance channel
   *
   * @param [baseURL] - Selected instance url
   * @param [channelHandle] - Channel handle
   * @param [queryParams] - Query params
   * @returns List of channel videos
   */
  async getChannelVideos(
    baseURL: string,
    channelHandle: string,
    queryParams: VideosCommonQuery,
  ): Promise<{ data: GetVideosVideo[]; total: number }> {
    try {
      const response = await this.instance.get(`video-channels/${channelHandle}/videos`, {
        params: {
          ...commonQueryParams,
          isLive: undefined,
          sort: "-originallyPublishedAt",
          ...queryParams,
        },
        baseURL: `https://${baseURL}/api/v1`,
      });

      return {
        data: response.data.data.map((video: Video) => {
          return {
            uuid: video.uuid,
            name: video.name,
            category: video.category,
            description: video.description,
            previewPath: `https://${baseURL}${video.previewPath}`,
            duration: video.duration,
            channel: video.channel,
            publishedAt: video.publishedAt,
            originallyPublishedAt: video.originallyPublishedAt,
            views: video.views,
            liveSchedules: video.liveSchedules,
          };
        }),
        total: response.data.total,
      };
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "channel videos");
    }
  }

  /**
   * Get a list of playlists on an instance channel
   *
   * @param [baseURL] - Selected instance url
   * @param [channelHandle] - Channel handle
   * @returns List of channel videos
   */
  async getChannelPlaylists(
    baseURL: string,
    channelHandle: string,
    enableSortingByPosition: boolean,
  ): Promise<VideoPlaylist[]> {
    try {
      const response = await this.instance.get<{ data: VideoPlaylist[]; total: number }>(
        `video-channels/${channelHandle}/video-playlists`,
        {
          baseURL: `https://${baseURL}/api/v1`,
          params: { count: 100, sort: enableSortingByPosition ? "videoChannelPosition" : undefined },
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "channel playlists");
    }
  }
}

export const ChannelsApiImpl = new ChannelsApi();
