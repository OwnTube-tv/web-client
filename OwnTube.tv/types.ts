export interface Video {
  readonly id: number;
  readonly name: string;
  readonly category: { id: number | null; label: string };
  readonly thumbnailPath: string;
  readonly thumbnailUrl?: string;
  readonly description?: string | null;
}

export interface Category {
  readonly label: string;
  readonly id: number;
}

export interface VideoServiceState {
  videos: Video[];
  categories: string[];
  error: string | null;
}
