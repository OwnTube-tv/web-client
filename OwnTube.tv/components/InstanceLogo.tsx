import { PeertubeLogo } from "./Svg";
import { Image, Platform, StyleSheet } from "react-native";
import { SvgUri } from "react-native-svg";
import { borderRadius } from "../theme";

interface InstanceLogoProps {
  size: number;
  logoUrl?: string;
}

const fallbackLogo = require("../public/logo192.png");

export const InstanceLogo = ({ size, logoUrl = "" }: InstanceLogoProps) => {
  const isLogoSvg = logoUrl?.endsWith("svg");

  if (!logoUrl) {
    return (
      <Image source={fallbackLogo} width={size} height={size} style={[styles.image, { height: size, width: size }]} />
    );
  }

  if (isLogoSvg && Platform.OS !== "web") {
    return (
      <SvgUri
        style={[styles.image, { height: size, width: size }]}
        uri={logoUrl}
        width={size}
        height={size}
        fallback={<PeertubeLogo width={size} height={size} />}
      />
    );
  }

  return (
    <Image
      style={[styles.image, { height: size, width: size }]}
      source={{ uri: logoUrl }}
      resizeMode="cover"
      width={size}
      height={size}
    />
  );
};

const styles = StyleSheet.create({
  image: { borderRadius: borderRadius.radiusMd },
});
