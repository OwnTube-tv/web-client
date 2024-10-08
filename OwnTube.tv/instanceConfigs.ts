import { z } from "zod";

const colorSchemeNameSchema = z.union([z.literal("light"), z.literal("dark"), z.null(), z.undefined()]);

const customizationsSchema = z.object({
  pageTitle: z.string(),
  homeLatestPublishedVideoCount: z.number(),
  homeRecentlyWatchedVideoCount: z.number(),
  homeHideChannelsOverview: z.boolean(),
  homeHideCategoriesOverview: z.boolean(),
  homeHidePlaylistsOverview: z.boolean(),
  pageDefaultTheme: colorSchemeNameSchema.optional(),
  menuHideHistoryButton: z.boolean().optional(),
  menuHideChannelsButton: z.boolean().optional(),
  menuHidePlaylistsButton: z.boolean().optional(),
  menuHideCategoriesButton: z.boolean().optional(),
  menuHideLeaveButton: z.boolean().optional(),
  playlistsHidden: z.array(z.string()).optional(),
  playlistsShowHiddenButton: z.boolean().optional(),
  showMoreSize: z.number().optional(),
});

export const instanceConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  hostname: z.string(),
  logoUrl: z.string().url().optional(),
  customizations: customizationsSchema.optional(),
  iconUrl: z.string().url().optional(),
  logoExtension: z.string().optional(),
});

export type InstanceConfig = z.infer<typeof instanceConfigSchema>;
