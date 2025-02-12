import { ROUTES } from "../types";

export const SHAREABLE_ROUTE_MODAL_TITLES: Record<string, string> = {
  [`/${ROUTES.HOME}`]: "shareVideoSite",
  [`/${ROUTES.VIDEO}`]: "shareVideo",
  [`/${ROUTES.CHANNEL}`]: "shareVideoChannel",
  [`/${ROUTES.CHANNEL_CATEGORY}`]: "shareVideoChannelCategory",
  [`/${ROUTES.PLAYLIST}`]: "sharePlaylist",
  [`/${ROUTES.CHANNEL_PLAYLIST}`]: "shareChannelPlaylist",
};
