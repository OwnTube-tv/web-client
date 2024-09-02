import { VideoPlaylist } from "@peertube/peertube-types";
import { Video } from "@peertube/peertube-types/peertube-models/videos/video.model";
import { GetVideosVideo, OwnTubeError } from "./models";
import i18n from "../i18n";
import { AxiosInstanceBasedApi } from "./axiosInstance";
import { AxiosError } from "axios";

/**
 * Get playlists from the PeerTube backend `/api/v1/video-playlists` API
 *
 * @description https://docs.joinpeertube.org/api-rest-reference.html#tag/Video-Playlists/operation/getPlaylists
 */
export class PlaylistsApi extends AxiosInstanceBasedApi {
  constructor() {
    super();
  }

  /**
   * Get a list of playlists from the PeerTube instance
   *
   * @param [baseURL] - Selected instance url
   * @returns List of playlists
   */
  async getPlaylists(baseURL: string): Promise<{ data: VideoPlaylist[]; total: number }> {
    try {
      const response = await this.instance.get<{ data: VideoPlaylist[]; total: number }>("video-playlists", {
        params: { count: 100, sort: "-updatedAt" },
        baseURL: `https://${baseURL}/api/v1`,
      });

      return response.data;
    } catch (error: unknown) {
      throw new Error(i18n.t("errors.failedToFetchPlaylists", { error: (error as Error).message }));
    }
  }

  /**
   * Get a list of videos on an instance playlist
   *
   * @param [baseURL] - Selected instance url
   * @param [playlistId] - Playlist ID
   * @param [queryParams] - Custom query params
   * @returns List of playlist videos
   */
  async getPlaylistVideos(
    baseURL: string,
    playlistId: number,
    queryParams?: { count: number },
  ): Promise<{ data: GetVideosVideo[]; total: number }> {
    try {
      const response = await this.instance.get<{ data: Array<{ video: Video }>; total: number }>(
        `video-playlists/${playlistId}/videos`,
        {
          params: { sort: "-originallyPublishedAt", ...(queryParams || {}) },
          baseURL: `https://${baseURL}/api/v1`,
        },
      );

      return {
        data: response.data.data.map(({ video }) => {
          return {
            uuid: video.uuid,
            name: video.name,
            category: video.category,
            description: video.description,
            thumbnailPath: `https://${baseURL}${video.thumbnailPath}`,
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
      const retryAfter = (error as AxiosError).response?.headers["retry-after"];

      if (retryAfter) {
        console.info("errors.tooManyRequests", { retryAfter });
      }

      return new Promise((_, reject) => {
        setTimeout(
          () => {
            reject(
              new OwnTubeError(
                i18n.t("errors.failedToFetchPlaylistVideos"),
                (error as AxiosError).response?.status,
                (error as AxiosError).message,
              ),
            );
          },
          (retryAfter ?? 0) * 1000, // QueryClient will handle the retry
        );
      });
    }
  }
}

export const PlaylistsApiImpl = new PlaylistsApi();
