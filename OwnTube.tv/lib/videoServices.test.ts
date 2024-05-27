import VideoService from "./videoServices";

describe("VideoService", () => {
  it("returns a list of unique category label names from testData.json", async () => {
    const videoService = new VideoService('testData.json');

    const categoryLabels = await videoService.getVideoCategoryLabels();
    expect(categoryLabels).toBeInstanceOf(Array);
    expect(categoryLabels.length).toBe(5);
    expect(categoryLabels).toContain("Gaming");
    expect(categoryLabels).toContain("Entertainment");
    expect(categoryLabels).toContain("Unknown");
    expect(categoryLabels).toContain("Art");
    expect(categoryLabels).toContain("Education");
  });

  it("returns a list with the correct number of videos from testData.json, for each label", async () => {
    const videoService = new VideoService('testData.json');

    const gamingVideos = await videoService.getVideosForCategory("Gaming");
    expect(gamingVideos).toBeInstanceOf(Array);
    expect(gamingVideos.length).toBe(6);

    const entertainmentVideos = await videoService.getVideosForCategory("Entertainment");
    expect(entertainmentVideos).toBeInstanceOf(Array);
    expect(entertainmentVideos.length).toBe(1);

    const unknownVideos = await videoService.getVideosForCategory("Unknown");
    expect(unknownVideos).toBeInstanceOf(Array);
    expect(unknownVideos.length).toBe(6);

    const artVideos = await videoService.getVideosForCategory("Art");
    expect(artVideos).toBeInstanceOf(Array);
    expect(artVideos.length).toBe(1);

    const educationVideos = await videoService.getVideosForCategory("Education");
    expect(educationVideos).toBeInstanceOf(Array);
    expect(educationVideos.length).toBe(1);

    const undefinedLabelVideos = await videoService.getVideosForCategory("Undefined, just made up from nowhere!");
    expect(undefinedLabelVideos).toBeInstanceOf(Array);
    expect(undefinedLabelVideos.length).toBe(0);
  });

  it("returns a total 15 videos from testData.json, all with id, name, category, description, and thumbnailPath", async () => {
    const videoService = new VideoService('testData.json');
    const allVideos = [];
    for (const label of await videoService.getVideoCategoryLabels()) {
      const categoryVideos = await videoService.getVideosForCategory(label);
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

  it("returns a list of videos from the PeerTube Nightly external API, when not initialized with test data", async () => {
    const videoService = new VideoService('peertube2.cpy.re');

    // We expect that after initializing the service with the PeerTube Nightly API, data will be loaded.
    // This may be difficult to confirm in this test, but we can verify that the number of retrieved videos is not zero.
    const allVideos = await videoService.getVideosForCategory("Unknown");

    expect(allVideos).toBeInstanceOf(Array);
    expect(allVideos.length).toBeGreaterThan(0); // Verifying that at least one video is retrieved
  });

  it("can first return videos from testData.json and then from a external API", async () => {
    const videoService = new VideoService('testData.json');

    
  });
});
