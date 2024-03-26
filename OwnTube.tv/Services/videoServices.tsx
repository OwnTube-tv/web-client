
import * as fs from 'fs/promises';
import * as testData from '../testData.json';

interface Video {
  readonly id: number;
  readonly name: string;
  readonly category: { id: number | null; label: string };
  readonly thumbnailPath: string;
}

interface Category {
  readonly id: number;
  readonly label: string;
}

interface CategoryLabel {
  readonly id: number | null ;
  readonly label: string;
}

const BaseThumbnailUrl = 'https://peertube2.cpy.re'

class VideoService {
  private videos: Video[] = [];
  private categories: Category[] = [];
 


  public extractCategoryLabels(): CategoryLabel[] {
    const uniqueCategories = this.videos
      .map((video) => video.category)
      .filter((category, index, array) => array.findIndex(c => c.id === category.id) === index)
      .map(({ id, label }) => ({ id, label }));
  
    if (uniqueCategories.length !== this.videos.length) {
      console.warn('Duplicate categories found in videos.');
    }
  
    return uniqueCategories;
  }
  public completeThumbnailUrls(): Video[] {
    // Map over each incomplete URL and combine it with the base URL
    const correctThumbnail = this.videos
    .map(video => ({ ...video,
      thumbnailPath: `${BaseThumbnailUrl}${video.thumbnailPath}`
    }));
    return correctThumbnail;
  }
  
  // Public method to get videos for a specific category
  public getVideosForCategory(categoryLabel: CategoryLabel): Video[] {
    return this.videos.filter(video => {
      if (video.category.id === null && categoryLabel.id === null) {
        return true; // Both IDs are null, so they match
      } else if (video.category.id !== null && categoryLabel.id !== null) {
        return video.category.id === categoryLabel.id; // Compare non-null IDs
      } else {
        return false; // IDs don't match (one is null and the other is not)
      }
    });
  }

  // New method to load videos from a local JSON file
  public loadVideosFromJson(): void {
    try {
      const data = testData;
      this.videos = data.data || [];
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        throw new Error(`Failed to parse JSON file: ${error.message}`);
      } else {
        throw new Error(`Failed to load videos from JSON file: ${error.message}`);
      }
    }
  }
}

export default VideoService;
