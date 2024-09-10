import ContentLoader from "react-content-loader/native";
import { IContentLoaderProps } from "react-content-loader/native";
import { Rect } from "react-native-svg";
import { useTheme } from "@react-navigation/native";

const VideoGridCardLoader = (props: IContentLoaderProps) => {
  const { colors } = useTheme();

  return (
    <ContentLoader
      speed={1}
      width={"100%"}
      height={"100%"}
      viewBox="0 0 360 314"
      backgroundColor={colors.theme200}
      foregroundColor={colors.theme100}
      {...props}
    >
      <Rect x="0" y="-1" rx="8" ry="8" width="360" height="202" />
      <Rect x="8" y="213" rx="4" ry="4" width="344" height="24" />
      <Rect x="8" y="246" rx="4" ry="4" width="320" height="24" />
      <Rect x="8" y="282" rx="4" ry="4" width="140" height="12" />
      <Rect x="8" y="302" rx="4" ry="4" width="156" height="12" />
    </ContentLoader>
  );
};

export default VideoGridCardLoader;
