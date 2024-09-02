import { Loader, VideoGrid } from "../../../components";
import { useGetPlaylistVideosQuery } from "../../../api";

interface PlaylistVideosViewProps {
  id: number;
  title: string;
}

export const PlaylistVideosView = ({ id, title }: PlaylistVideosViewProps) => {
  const { data, isFetching } = useGetPlaylistVideosQuery(id);

  if (isFetching) {
    return <Loader />;
  }

  return <VideoGrid title={title} data={data?.data} />;
};
