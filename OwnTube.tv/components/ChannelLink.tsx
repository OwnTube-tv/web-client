import { Link } from "expo-router";
import { FC } from "react";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { useHoverState } from "../hooks";
import { Pressable } from "react-native";

interface ChannelLinkProps {
  href: string;
  text: string;
}

export const ChannelLink: FC<ChannelLinkProps> = ({ href, text }) => {
  const { colors } = useTheme();
  const { isHovered, toggleHovered } = useHoverState();

  return (
    <Link href={href}>
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
