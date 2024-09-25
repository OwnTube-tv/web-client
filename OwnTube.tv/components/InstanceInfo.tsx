import { borderRadius, spacing } from "../theme";
import { Image, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { useGetInstanceInfoQuery } from "../api";
import { useMemo } from "react";
import { useInstanceConfig } from "../hooks";
import { PeertubeLogo } from "./Svg";
import { SvgUri } from "react-native-svg";

const fallbackLogo = require("../public/logo192.png");

interface InstanceInfoProps {
  backend?: string;
  showText?: boolean;
}

export const InstanceInfo = ({ backend, showText = true }: InstanceInfoProps) => {
  const { colors } = useTheme();
  const { data } = useGetInstanceInfoQuery(backend);
  const { currentInstanceConfig } = useInstanceConfig();

  const logoSrc = useMemo(() => {
    return currentInstanceConfig?.iconUrl
      ? { uri: currentInstanceConfig?.iconUrl }
      : data?.avatars?.[0]
        ? { uri: `https://${backend}${data?.avatars[0]?.path}` }
        : fallbackLogo;
  }, [currentInstanceConfig, data, backend]);

  const isLogoSvg = logoSrc?.uri?.endsWith("svg");

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: !showText ? "center" : undefined,
          paddingBottom: !showText ? spacing.md : undefined,
        },
      ]}
    >
      {isLogoSvg ? (
        <SvgUri uri={logoSrc?.uri} width={32} height={32} fallback={<PeertubeLogo width={32} height={32} />} />
      ) : (
        <Image style={[styles.image, { backgroundColor: colors.theme950 }]} resizeMode="cover" source={logoSrc} />
      )}
      {showText && (
        <Typography fontSize="sizeSm" fontWeight="SemiBold" color={colors.theme950} numberOfLines={1}>
          {data?.name}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  image: { borderRadius: borderRadius.radiusMd, height: 32, width: 32 },
});
