import VideoService from "./videoServices";

describe("VideoService", () => {
  it("returns a list of unique category label names from testData.json", () => {
    const videoService = new VideoService();

    const categoryLabels = videoService.getVideoCategoryLabels();
    expect(categoryLabels).toBeInstanceOf(Array);
    expect(categoryLabels.length).toBe(5);
    expect(categoryLabels).toContain("Gaming");
    expect(categoryLabels).toContain("Entertainment");
    expect(categoryLabels).toContain("Unknown");
    expect(categoryLabels).toContain("Art");
    expect(categoryLabels).toContain("Education");
  });

  it("returns a list with the correct number of videos from testData.json, for each label", () => {
    const videoService = new VideoService();

    const gamingVideos = videoService.getVideosForCategory("Gaming");
    expect(gamingVideos).toBeInstanceOf(Array);
    expect(gamingVideos.length).toBe(6);

    const entertainmentVideos = videoService.getVideosForCategory("Entertainment");
    expect(entertainmentVideos).toBeInstanceOf(Array);
    expect(entertainmentVideos.length).toBe(1);

    const unknownVideos = videoService.getVideosForCategory("Unknown");
    expect(unknownVideos).toBeInstanceOf(Array);
    expect(unknownVideos.length).toBe(6);

    const artVideos = videoService.getVideosForCategory("Art");
    expect(artVideos).toBeInstanceOf(Array);
    expect(artVideos.length).toBe(1);

    const educationVideos = videoService.getVideosForCategory("Education");
    expect(educationVideos).toBeInstanceOf(Array);
    expect(educationVideos.length).toBe(1);

    const undefinedLabelVideos = videoService.getVideosForCategory("Undefined, just made up from nowhere!");
    expect(undefinedLabelVideos).toBeInstanceOf(Array);
    expect(undefinedLabelVideos.length).toBe(0);
  });

  it("returns a total 15 videos with from testData.json, all with id, name, category, description, and thumbnailPath", () => {
    const videoService = new VideoService();
    const allVideos = [];
    for (const label of videoService.getVideoCategoryLabels()) {
      const categoryVideos = videoService.getVideosForCategory(label);
      allVideos.push(...categoryVideos);
    }

    expect(allVideos.length).toBe(15);

    for (const video of allVideos) {
      expect(Number.isInteger(video.id)).toBe(true);
      expect(typeof video.name).toBe("string");
      if (video.category.id) {
        expect(video.category).toMatchObject({ id: expect.any(Number), label: expect.any(String) });
      } else {
        expect(video.category).toMatchObject({ id: null, label: expect.any(String) });
      }
      if (video.description) {
        expect(typeof video.description).toBe("string");
      } else {
        expect(video.description).toBeNull();
      }
      expect(typeof video.thumbnailPath).toBe("string");
    }
  });
});
