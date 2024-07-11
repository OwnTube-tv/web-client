import { Dimensions } from "react-native";
import { Channel, GetVideosVideo } from "../api/models";

export const getThumbnailDimensions = () => {
  const screenWidth = Dimensions.get("window").width;
  const width = screenWidth * 0.25;
  const height = width * 0.6 + 50;

  return { width, height };
};

export const capitalize = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export type CategorizedVideos = Record<string, GetVideosVideo[]>;
export type VideosByChannel = Array<{ channel: Channel; data: CategorizedVideos }>;

export const organizeVideosByChannelAndCategory = (data: GetVideosVideo[]): VideosByChannel => {
  return data.reduce<VideosByChannel>((result, item) => {
    const { channel, category } = item;
    const channelName = channel.name;
    const categoryName = category.label;

    let channelObj = result.find((c) => c.channel.name === channelName);

    if (!channelObj) {
      channelObj = { channel, data: {} };
      result.push(channelObj);
    }

    if (!channelObj.data[categoryName]) {
      channelObj.data[categoryName] = [];
    }

    channelObj.data[categoryName].push(item);

    return result;
  }, []);
};
