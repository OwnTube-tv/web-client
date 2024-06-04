import { PeertubeVideosApi } from "../peertubeVideosApi";

describe("peertubeVideosApi", () => {
  it("should return a list of videos, maximum 15 to default", async () => {
    const peertubeVideosApi = new PeertubeVideosApi();
    const videos = await peertubeVideosApi.getVideos("http://peertube2.cpy.re");

    expect(videos).toBeDefined();
    expect(videos.length).toBeLessThanOrEqual(15);
  });

  it("should return a list of videos, limited to maximum 2 when specified", async () => {
    const peertubeVideosApi = new PeertubeVideosApi();
    const videos = await peertubeVideosApi.getVideos("http://peertube2.cpy.re", 2);

    expect(videos).toBeDefined();
    expect(videos.length).toBeLessThanOrEqual(2);
  });

  // it("should return a list of videos, but not more than the total available videos", async () => {
  //   const peertubeVideosApi = new PeertubeVideosApi();
  //   const totalVideos = await peertubeVideosApi.getTotalVideos("http://peertube2.cpy.re");
  //
  //   peertubeVideosApi.maxChunkSize = Math.floor(totalVideos / 2) - 1;
  //   let videos = await peertubeVideosApi.getVideos("http://peertube2.cpy.re", totalVideos + 1);
  //   expect(videos).toBeDefined();
  //   expect(videos.length).toBe(totalVideos);
  //
  //   peertubeVideosApi.maxChunkSize = totalVideos + 5;
  //   videos = await peertubeVideosApi.getVideos("http://peertube2.cpy.re", totalVideos + 1);
  //   expect(videos).toBeDefined();
  //   expect(videos.length).toBe(totalVideos);
  // });
});
