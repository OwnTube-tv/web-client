import testData from "../testData.json"

interface Video {
  id: number;
  name: string;
  category: { id: number; label: string };
  thumbnailPath: string;
}

interface Category {
  id: number;
  label: string;
}

interface CategoryLabel {
  id: number;
  label: string;
}

class VideoService {
  private videos: Video[] = [];
  private categories: Category[] = [];

  // Helper method to extract category labels from private videos list
  private extractCategoryLabels(): CategoryLabel[] {
    return this.videos.map((video) => video.category)
      .filter((category, index, array) => array.findIndex(c => c.id === category.id) === index)
      .map(({ id, label }) => ({ id, label }));
  }

  // Public method to get video category labels
  public getVideoCategoryLabels(): CategoryLabel[] {
    if (this.categories.length === 0) {
      this.categories = this.extractCategoryLabels();
    }
    return this.categories;
  }

  // Public method to get videos for a specific category
  public getVideosForCategory(categoryLabel: CategoryLabel): Video[] {
    return this.videos.filter(video => video.category.id === categoryLabel.id);
  }

  // New method to load videos from a local JSON file
  public async loadVideosFromJson(): Promise<void> {
    try {
      const response = await fetch('./testData.json'); // Assuming testData.json is in the same directory

      if (!response.ok) {
        throw new Error(`Failed to load videos from JSON file: ${response.statusText}`);
      }
      const responseData = await response.json();
      this.videos = responseData.data || [];
    } catch (error) {
      throw error;
    }
  }
}

export default VideoService;
