import { capitalize, organizeVideosByChannelAndCategory } from "./common";
import { GetVideosVideo } from "../api/models";

describe("capitalize", () => {
  it("should capitalize a string", () => {
    expect(capitalize("testing")).toBe("Testing");
  });
});

const mockVideosData: GetVideosVideo[] = [
  {
    channel: {
      name: "Channel1",
      id: 0,
      displayName: "",
      url: "",
      host: "",
      avatars: [],
      avatar: {
        width: 0,
        path: "",
        createdAt: "",
        updatedAt: "",
      },
    },
    category: {
      label: "Category1",
      id: null,
    },
    uuid: "123",
    duration: 50,
    description: "1234",
    name: "videoName",
    thumbnailPath: "example.com/",
  },
  {
    channel: {
      name: "Channel1",
      id: 0,
      displayName: "",
      url: "",
      host: "",
      avatars: [],
      avatar: {
        width: 0,
        path: "",
        createdAt: "",
        updatedAt: "",
      },
    },
    category: {
      label: "Category2",
      id: null,
    },
    uuid: "456",
    duration: 50,
    description: "1234",
    name: "videoName",
    thumbnailPath: "example.com/",
  },
  {
    channel: {
      name: "Channel2",
      id: 0,
      displayName: "",
      url: "",
      host: "",
      avatars: [],
      avatar: {
        width: 0,
        path: "",
        createdAt: "",
        updatedAt: "",
      },
    },
    category: {
      label: "Category1",
      id: null,
    },
    uuid: "789",
    duration: 50,
    description: "1234",
    name: "videoName",
    thumbnailPath: "example.com/",
  },
  {
    channel: {
      name: "Channel1",
      id: 0,
      displayName: "",
      url: "",
      host: "",
      avatars: [],
      avatar: {
        width: 0,
        path: "",
        createdAt: "",
        updatedAt: "",
      },
    },
    category: {
      label: "Category1",
      id: null,
    },
    uuid: "101",
    duration: 50,
    description: "1234",
    name: "videoName",
    thumbnailPath: "example.com/",
  },
];

describe("organizeVideosByChannelAndCategory", () => {
  it("should organize videos by channel and category", () => {
    const result = organizeVideosByChannelAndCategory(mockVideosData);

    expect(
      result.map(({ channel, data }) => ({
        channel: channel.name,
        data: Object.entries(data)
          .map((entry) => entry[1].map(({ uuid }) => uuid).join(""))
          .join(""),
      })),
    ).toStrictEqual([
      { channel: "Channel1", data: "123101456" },
      { channel: "Channel2", data: "789" },
    ]);
  });

  it("should handle empty data array", () => {
    const data: GetVideosVideo[] = [];
    const result = organizeVideosByChannelAndCategory(data);
    expect(result).toEqual([]);
  });
});
