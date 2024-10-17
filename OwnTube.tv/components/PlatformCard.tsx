import { View, Image, StyleSheet, Pressable } from "react-native";
import { Typography } from "./Typography";
import { Link } from "expo-router";
import { borderRadius, spacing } from "../theme";
import { useTheme } from "@react-navigation/native";
import { useBreakpoints, useHoverState } from "../hooks";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { PeertubeLogo } from "./Svg";
import { SvgUri } from "react-native-svg";

interface PlatformCardProps {
  name?: string;
  description?: string;
  hostname?: string;
  logoUrl?: string;
}

export const PlatformCard = ({ name, description, hostname, logoUrl }: PlatformCardProps) => {
  const { colors } = useTheme();
  const { isHovered, hoverHandlers } = useHoverState();
  const { isDesktop } = useBreakpoints();
  const isLogoSvg = logoUrl?.endsWith("svg");

  return (
    <Link href={{ pathname: "./", params: { backend: hostname } }} asChild>
      <Pressable style={styles.pressableContainer} {...hoverHandlers}>
        <View
          style={[
            styles.container,
            {
              padding: isDesktop ? spacing.xl : spacing.lg,
              borderColor: colors.theme200,
              backgroundColor: isHovered ? colors.theme200 : colors.theme100,
            },
          ]}
        >
          <View
            style={[
              styles.imageContainer,
              {
                backgroundColor: colors.white94,
              },
            ]}
          >
            {!logoUrl ? (
              <PeertubeLogo width={40} height={40} />
            ) : isLogoSvg ? (
              <SvgUri uri={logoUrl} width={40} height={40} fallback={<PeertubeLogo width={40} height={40} />} />
            ) : (
              <Image source={{ uri: logoUrl }} resizeMode="cover" style={styles.image} />
            )}
          </View>
          <View style={styles.textsContainer}>
            <View
              style={[
                styles.header,
                {
                  paddingBottom: isDesktop ? spacing.sm : spacing.xs,
                },
              ]}
            >
              <Typography
                style={styles.nameTextContainer}
                fontWeight="SemiBold"
                fontSize={isDesktop ? "sizeLg" : "sizeMd"}
                numberOfLines={1}
              >
                {name}
              </Typography>
              <IcoMoonIcon
                style={styles.arrow}
                name="Arrow-Left"
                size={24}
                color={isHovered ? colors.theme600 : colors.theme950}
              />
            </View>
            <Typography
              fontWeight="Regular"
              fontSize={isDesktop ? "sizeSm" : "sizeXS"}
              numberOfLines={4}
              style={styles.descriptionContainer}
            >
              {description}
            </Typography>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  arrow: { transform: [{ rotate: "180deg" }] },
  container: {
    borderRadius: borderRadius.radiusMd,
    borderWidth: 1,
    flexDirection: "row",
    flex: 1,
    gap: spacing.lg,
    height: "100%",
    maxWidth: 392,
    width: "100%",
  },
  descriptionContainer: { maxWidth: "100%" },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  image: { height: 40, width: 40 },
  imageContainer: { borderRadius: borderRadius.radiusMd, height: 40, overflow: "hidden", width: 40 },
  nameTextContainer: { width: "85%" },
  pressableContainer: {
    alignSelf: "flex-start",
    flex: 1,
    flexGrow: 1,
    height: "100%",
    width: "100%",
  },
  textsContainer: { width: "84%" },
});
