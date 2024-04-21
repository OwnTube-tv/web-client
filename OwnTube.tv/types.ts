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
