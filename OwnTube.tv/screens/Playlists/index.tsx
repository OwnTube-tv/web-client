import { useGetPlaylistsQuery } from "../../api";
import { PlaylistVideosView } from "./components";
import { Screen } from "../../layouts";
import { Loader } from "../../components";

export const Playlists = () => {
  const { data: playlists, isFetching } = useGetPlaylistsQuery();

  if (isFetching) {
    return <Loader />;
  }

  return (
    <Screen>
      {playlists?.data?.map(({ id, displayName }) => <PlaylistVideosView title={displayName} key={id} id={id} />)}
    </Screen>
  );
};
