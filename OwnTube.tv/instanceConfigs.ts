import { z } from "zod";

const colorSchemeNameSchema = z.union([z.literal("light"), z.literal("dark"), z.null(), z.undefined()]);

const customizationsSchema = z
  .strictObject({
    pageTitle: z.string(),
    homeLatestPublishedVideoCount: z.number(),
    homeRecentlyWatchedVideoCount: z.number(),
    homeHideChannelsOverview: z.boolean(),
    homeHideCategoriesOverview: z.boolean(),
    homeHidePlaylistsOverview: z.boolean(),
    homeUseHorizontalListsForMobilePortrait: z.boolean(),
    pageDefaultTheme: colorSchemeNameSchema,
    menuHideHistoryButton: z.boolean(),
    menuHideChannelsButton: z.boolean(),
    menuHidePlaylistsButton: z.boolean(),
    menuHideCategoriesButton: z.boolean(),
    menuHideLeaveButton: z.boolean(),
    playlistsHidden: z.array(z.string()),
    menuExternalLinks: z.array(z.object({ label: z.string(), url: z.string() })),
    playlistsShowHiddenButton: z.boolean(),
    showMoreSize: z.number(),
    hideVideoSiteLinks: z.boolean(),
    hideChannelPlaylistLinks: z.boolean(),
    loginWithUsernameAndPassword: z.boolean(),
    homeFeaturedLives: z.array(z.string()),
    refreshQueriesStaleTimeMs: z.number(),
    premiumContentAds: z.array(z.string()),
    loginAccessTokenExpirationOverride: z.number(),
    loginRefreshTokenExpirationOverride: z.number(),
    searchPageSize: z.number(),
  })
  .partial();

export const instanceConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  hostname: z.string(),
  logoUrl: z.string().url().optional(),
  customizations: customizationsSchema.optional(),
});

export type InstanceConfig = z.infer<typeof instanceConfigSchema>;
