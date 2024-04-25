export interface Video {
  id: number;
  name: string;
  category: { id: number | null; label: string };
  thumbnailPath: string;
  thumbnailUrl?: string;
  description?: string | null;
}

export interface Category {
  label: string;
  id: number;
}

export enum SOURCES {
  PEERTUBE = "https://peertube2.cpy.re",
  REBELLION = "https://tube.rebellion.global",
}

export enum STORAGE {
  DATASOURCE = "data_source",
}
