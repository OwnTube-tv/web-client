import { colors, typography } from "./theme";

export enum SOURCES {
  PEERTUBE = "https://peertube2.cpy.re",
  REBELLION = "https://tube.rebellion.global",
}

export enum STORAGE {
  DATASOURCE = "data_source",
}

export enum ROUTES {
  HOME = "Home",
  SETTINGS = "Settings",
  PROFILE = "Profile",
}

export type Theme = {
  colors: typeof colors.light;
  typography: typeof typography;
};

export interface Category {
  label: string;
  id: number;
}

export interface Video {
  id: number;
  name: string;
  category: Category;
  thumbnailPath: string;
  thumbnailUrl?: string;
  description?: string | null;
}

export interface VideoCategory extends Category {
  videos: Video[];
}
