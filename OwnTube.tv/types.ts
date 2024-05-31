import { colors, typography } from "./theme";

export enum SOURCES {
  PEERTUBE = "https://peertube2.cpy.re",
  REBELLION = "https://tube.rebellion.global",
  TEST_DATA = "Test Data",
}

export enum STORAGE {
  DATASOURCE = "data_source",
}

export enum ROUTES {
  INDEX = "index",
  SETTINGS = "settings",
  VIDEO = "video",
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
