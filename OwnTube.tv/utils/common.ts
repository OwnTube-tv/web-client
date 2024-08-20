import { Channel, GetVideosVideo } from "../api/models";

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
