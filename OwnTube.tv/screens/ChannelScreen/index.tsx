import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { Screen } from "../../layouts";
import { useGetCategoriesQuery, useGetChannelInfoQuery, useGetChannelPlaylistsQuery } from "../../api";
import { CategoryView, LatestVideos } from "./components";
import { Loader } from "../../components";
import { PlaylistVideosView } from "../Playlists/components";
import { ListInfoHeader } from "../../components";

export const ChannelScreen = () => {
  const { backend, channel } = useLocalSearchParams<RootStackParams[ROUTES.CHANNEL]>();

  const { data: channelInfo, isLoading: isLoadingChannelInfo } = useGetChannelInfoQuery(channel);
  const { data: categories } = useGetCategoriesQuery();
  const { data: playlists } = useGetChannelPlaylistsQuery(channel);

  return (
    <Screen style={{ padding: 0 }}>
      {isLoadingChannelInfo ? (
        <Loader />
      ) : (
        <ListInfoHeader
          avatarUrl={
            channelInfo?.avatars?.[0]?.path ? `https://${backend}${channelInfo?.avatars?.[0]?.path}` : undefined
          }
          name={channelInfo?.displayName}
          description={channelInfo?.description}
        />
      )}
      <LatestVideos />
      {playlists?.map(({ uuid, displayName, id, videoChannel }) => (
        <PlaylistVideosView channel={videoChannel?.name} id={id} title={displayName} key={uuid} />
      ))}
      {categories?.map((category) => <CategoryView channelHandle={channel} category={category} key={category.id} />)}
    </Screen>
  );
};
