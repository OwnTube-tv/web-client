import { PeertubeVideosApi } from "./peertubeVideosApi";

describe("peertubeVideosApi", () => {
  it("should return a list of videos, maximum 15 to default", async () => {
    const peertubeVideosApi = new PeertubeVideosApi("peertube2.cpy.re");
    const videos = await peertubeVideosApi.getVideos();

    expect(videos).toBeDefined();
    expect(videos.length).toBe(15);
  });

  it("should return a list of videos, limited to maximum 5 when specified", async () => {
    const peertubeVideosApi = new PeertubeVideosApi("peertube2.cpy.re");
    const videos = await peertubeVideosApi.getVideos(5);

    expect(videos).toBeDefined();
    expect(videos.length).toBe(5);
  });

  it("should return a list of videos, fetching maximum 3 per request when specified", async () => {
    // This should call the PeerTube API with a request for 3 videos, then the next 3, and then 1 last video (flip debugLogging to true to see the requests in the console)
    const peertubeVideosApi = new PeertubeVideosApi("peertube2.cpy.re", 3, false);
    const videos = await peertubeVideosApi.getVideos(7);

    expect(videos).toBeDefined();
    expect(videos.length).toBe(7);
  });

  it("should return a list of videos, but not more than the total available videos", async () => {
    const peertubeVideosApi = new PeertubeVideosApi("peertube2.cpy.re");
    const totalVideos = await peertubeVideosApi.getTotalVideos();

    peertubeVideosApi.maxChunkSize = Math.floor(totalVideos / 2) - 1;
    // peertubeVideosApi.debugLogging = true;
    let videos = await peertubeVideosApi.getVideos(totalVideos + 1);
    // peertubeVideosApi.debugLogging = false;
    expect(videos).toBeDefined();
    expect(videos.length).toBe(totalVideos);

    peertubeVideosApi.maxChunkSize = totalVideos + 5;
    videos = await peertubeVideosApi.getVideos(totalVideos + 1);
    expect(videos).toBeDefined();
    expect(videos.length).toBe(totalVideos);
  });

  it("should return a list of videos, each with the properties indicated by the typing", async () => {
    const peertubeVideosApi = new PeertubeVideosApi("peertube2.cpy.re");
    const totalVideos = await peertubeVideosApi.getTotalVideos();
    const videos = await peertubeVideosApi.getVideos(totalVideos);

    expect(videos).toBeDefined();
    expect(videos.length).toBe(totalVideos);
    videos.forEach((video) => {
      expect(new Set(Object.keys(video))).toEqual(new Set(["id", "name", "category", "description", "thumbnailPath"]));
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
    });
  });

  it("should return a list of videos, each with a unique id", async () => {
    const peertubeVideosApi = new PeertubeVideosApi("peertube2.cpy.re");
    const totalVideos = await peertubeVideosApi.getTotalVideos();
    const videos = await peertubeVideosApi.getVideos(totalVideos);

    expect(videos).toBeDefined();
    expect(videos.length).toBe(totalVideos);
    const idSet = new Set(videos.map((video) => video.id));
    expect(idSet.size).toBe(totalVideos);
  });
});
