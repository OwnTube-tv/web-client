import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { Screen } from "../../layouts";
import { useGetCategoriesQuery, useGetChannelInfoQuery } from "../../api";
import { CategoryView, ChannelInfoHeader, LatestVideos } from "./components";
import { Loader } from "../../components";

export const ChannelScreen = () => {
  const { backend, channel } = useLocalSearchParams<RootStackParams[ROUTES.CHANNEL]>();

  const { data: channelInfo, isLoading: isLoadingChannelInfo } = useGetChannelInfoQuery(backend, channel);
  const { data: categories } = useGetCategoriesQuery();

  return (
    <Screen style={{ padding: 0 }}>
      {isLoadingChannelInfo ? (
        <Loader />
      ) : (
        <ChannelInfoHeader
          avatarUrl={
            channelInfo?.avatars?.[0]?.path ? `https://${backend}${channelInfo?.avatars?.[0]?.path}` : undefined
          }
          name={channelInfo?.displayName}
          description={channelInfo?.description}
        />
      )}
      <LatestVideos />
      {categories?.map((category) => <CategoryView channelHandle={channel} category={category} key={category.id} />)}
    </Screen>
  );
};
