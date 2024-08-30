import { VideoChannel } from "@peertube/peertube-types";
import { Video } from "@peertube/peertube-types/peertube-models/videos/video.model";
import { GetVideosVideo } from "./models";
import i18n from "../i18n";
import { AxiosInstanceBasedApi } from "./axiosInstance";
import { commonQueryParams } from "./constants";

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
      throw new Error(i18n.t("errors.failedToFetchTotalVids", { error: (error as Error).message }));
    }
  }

  /**
   * Get a list of videos on an instance channel
   *
   * @param [baseURL] - Selected instance url
   * @param [channelHandle] - Channel handle
   * @param [count] - Count of videos to fetch
   * @returns List of channel videos
   */
  async getChannelVideos(
    baseURL: string,
    channelHandle: string,
    count: number,
  ): Promise<{ data: GetVideosVideo[]; total: number }> {
    try {
      const response = await this.instance.get(`video-channels/${channelHandle}/videos`, {
        params: { ...commonQueryParams, sort: "-originallyPublishedAt", count },
        baseURL: `https://${baseURL}/api/v1`,
      });

      return {
        data: response.data.data.map((video: Video) => {
          return {
            uuid: video.uuid,
            name: video.name,
            category: video.category,
            description: video.description,
            thumbnailPath: video.thumbnailPath,
            duration: video.duration,
            channel: video.channel,
            publishedAt: video.publishedAt,
            originallyPublishedAt: video.originallyPublishedAt,
            views: video.views,
          };
        }),
        total: response.data.total,
      };
    } catch (error: unknown) {
      throw new Error(i18n.t("errors.failedToFetchTotalVids", { error: (error as Error).message }));
    }
  }
}

export const ChannelsApiImpl = new ChannelsApi();
