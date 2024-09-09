import { AxiosInstanceBasedApi } from "./axiosInstance";
import { handleAxiosErrorWithRetry } from "./errorHandler";

/**
 * Get available categories from the PeerTube backend `/api/v1/videos/categories` API
 *
 * @description https://docs.joinpeertube.org/api-rest-reference.html#tag/Video/operation/getCategories
 */
export class CategoriesApi extends AxiosInstanceBasedApi {
  constructor() {
    super();
  }

  /**
   * Get a list of available categories from the PeerTube instance
   *
   * @param [baseURL] - Selected instance url
   * @returns List of available categories
   */
  async getCategories(baseURL: string): Promise<Array<{ name: string; id: number }>> {
    try {
      const response = await this.instance.get<Record<number, string>>("videos/categories", {
        baseURL: `https://${baseURL}/api/v1`,
      });

      return Object.entries(response.data).map(([id, name]) => ({ id: Number(id), name }));
    } catch (error: unknown) {
      return handleAxiosErrorWithRetry(error, "categories");
    }
  }
}

export const CategoriesApiImpl = new CategoriesApi();
