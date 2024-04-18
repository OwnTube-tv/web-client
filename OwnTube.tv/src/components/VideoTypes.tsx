export interface CategoryLabel {
  id: number | null;
  label: string;
}
export interface Category {
  readonly label: string;
  readonly id: number;
}

export interface Video {
  id: number;
  name: string;
  category: { id: number | null; label: string };
  thumbnailPath: string;
  description?: string | null;
  thumbnailUrl?: string;
}

export interface VideoCategoryPreviewProps {
  category: CategoryLabel;
  videos: Video[];
}

export interface MainPageProps {
  videos: Video[];
  categories: CategoryLabel[];
}

export interface VideoServiceState {
  videos: Video[];
  categories: string[];
  error: string | null;
  isLoading: boolean;
}
