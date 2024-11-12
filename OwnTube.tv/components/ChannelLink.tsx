import { Link } from "expo-router";
import { FC, useState } from "react";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { useHoverState } from "../hooks";
import { Pressable } from "react-native";
import { LinkProps } from "expo-router/build/link/Link";
import { ROUTES } from "../types";

interface ChannelLinkProps {
  href: LinkProps<ROUTES>["href"];
  text: string;
  enableOnTV?: boolean;
}

export const ChannelLink: FC<ChannelLinkProps> = ({ href, text, enableOnTV = false }) => {
  const { colors } = useTheme();
  const { isHovered, toggleHovered } = useHoverState();
  const [focused, setFocused] = useState(false);

  return (
    <Link href={href} asChild>
      <Pressable
        focusable={enableOnTV}
        isTVSelectable={enableOnTV}
        onHoverIn={toggleHovered}
        onHoverOut={toggleHovered}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <Typography
          style={{ textDecorationLine: isHovered || focused ? "underline" : undefined }}
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
