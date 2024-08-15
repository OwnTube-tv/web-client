import Svg, { G, Path } from "react-native-svg";
import { SvgProps } from "react-native-svg/src/elements/Svg";

const SvgComponent = (props: SvgProps) => (
  <Svg width={512} height={682.688} viewBox="2799 -911 512 682.688" {...props}>
    <G strokeWidth={32}>
      <Path fill="#211f20" d="M2799-911v341.344l256-170.656" />
      <Path fill="#737373" d="M2799-569.656v341.344l256-170.656" />
      <Path fill="#f1680d" d="M3055-740.344V-399l256-170.656" />
    </G>
  </Svg>
);
export { SvgComponent as PeertubeLogo };
