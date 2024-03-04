export interface Video {
  id: number;
  name: string;
  category: {
    id: number;
    label: string;
  };
  thumbnailPath: string;
}

export interface CategoryLabel {
  id: number;
  label: string;
}
