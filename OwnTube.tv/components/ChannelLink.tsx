import { Link } from "expo-router";
import { FC } from "react";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { useHoverState } from "../hooks";
import { Pressable } from "react-native";
import { LinkProps } from "expo-router/build/link/Link";
import { ROUTES } from "../types";

interface ChannelLinkProps {
  href: LinkProps<ROUTES>["href"];
  text: string;
}

export const ChannelLink: FC<ChannelLinkProps> = ({ href, text }) => {
  const { colors } = useTheme();
  const { isHovered, toggleHovered } = useHoverState();

  return (
    <Link href={href} asChild>
      <Pressable onHoverIn={toggleHovered} onHoverOut={toggleHovered}>
        <Typography
          style={{ textDecorationLine: isHovered ? "underline" : undefined }}
          fontSize="sizeSm"
          fontWeight="Medium"
          color={colors.themeDesaturated500}
        >
          {text}
        </Typography>
      </Pressable>
    </Link>
  );
};
