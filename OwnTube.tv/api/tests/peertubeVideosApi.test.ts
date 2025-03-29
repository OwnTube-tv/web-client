import { PeertubeVideosApi } from "../peertubeVideosApi";

describe("peertubeVideosApi", () => {
  it("should return a list of videos, maximum 15 to default", async () => {
    const peertubeVideosApi = new PeertubeVideosApi();
    const videos = await peertubeVideosApi.getVideos("peertube2.cpy.re");

    expect(videos).toBeDefined();
    expect(videos.data.length).toBeLessThanOrEqual(15);
  }, 10000);

  it("should return a list of videos, limited to maximum 2 when specified", async () => {
    const peertubeVideosApi = new PeertubeVideosApi();
    const videos = await peertubeVideosApi.getVideos("peertube2.cpy.re", { count: 2 });

    expect(videos).toBeDefined();
    expect(videos.data.length).toBeLessThanOrEqual(2);
  }, 10000);

  // it("should return total number of videos", async () => {
  //   const peertubeVideosApi = new PeertubeVideosApi();
  //   const total = await peertubeVideosApi.getTotalVideos("peertube2.cpy.re");
  //
  //   expect(total).toBe(28);
  // });

  it("should return a list of videos, but not more than the total available videos", async () => {
    const peertubeVideosApi = new PeertubeVideosApi();
    const totalVideos = await peertubeVideosApi.getTotalVideos("peertube2.cpy.re");

    peertubeVideosApi.maxChunkSize = Math.floor(totalVideos / 2) - 1;
    let videos = await peertubeVideosApi.getVideos("peertube2.cpy.re", { count: totalVideos + 1 });
    expect(videos).toBeDefined();
    expect(videos.data.length).toBe(totalVideos);

    peertubeVideosApi.maxChunkSize = totalVideos + 5;
    videos = await peertubeVideosApi.getVideos("peertube2.cpy.re", { count: totalVideos + 1 });
    expect(videos).toBeDefined();
    expect(videos.data.length).toBe(totalVideos);
  }, 10000);

  it("should get video info by uuid", async () => {
    const peertubeVideosApi = new PeertubeVideosApi();
    const videoInfo = await peertubeVideosApi.getVideo("peertube2.cpy.re", "04af977f-4201-4697-be67-a8d8cae6fa7a");

    expect(videoInfo).toBeDefined();
    expect(videoInfo.name).toBe("The Internet's Own Boy");
  }, 10000);
});
