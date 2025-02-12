import { View, StyleSheet, Pressable } from "react-native";
import { Typography } from "./Typography";
import { Link } from "expo-router";
import { borderRadius, spacing } from "../theme";
import { useTheme } from "@react-navigation/native";
import { useBreakpoints, useHoverState } from "../hooks";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { InstanceLogo } from "./InstanceLogo";
import { ROUTES } from "../types";
import { useState } from "react";

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
  const [focused, setFocused] = useState(false);

  return (
    <Link href={{ pathname: `/${ROUTES.HOME}`, params: { backend: hostname } }} replace asChild>
      <Pressable
        style={styles.pressableContainer}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...hoverHandlers}
      >
        <View
          style={[
            styles.container,
            {
              borderWidth: focused ? 2 : 1,
              padding: (isDesktop ? spacing.xl : spacing.lg) - (focused ? 1 : 0),
              borderColor: focused ? colors.theme950 : colors.theme200,
              backgroundColor: isHovered ? colors.theme200 : colors.theme100,
            },
          ]}
        >
          <View style={styles.imageContainer}>
            <InstanceLogo logoUrl={logoUrl} size={40} />
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
