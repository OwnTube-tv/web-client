import Markdown, { MarkdownIt, RenderRules } from "react-native-markdown-display";
import { Typography } from "./Typography";
import { Link } from "expo-router";
import { FC, PropsWithChildren } from "react";
import { useTheme } from "@react-navigation/native";
import { spacing } from "../theme";

const SelectableBodyText: FC<PropsWithChildren> = ({ children }) => {
  const { colors } = useTheme();

  return (
    <Typography
      onLongPress={() => {}} // to add selection highlighting
      selectionColor={colors.theme500}
      selectable
      fontSize="sizeSm"
      fontWeight="Regular"
    >
      {children}
    </Typography>
  );
};

const formatterRules: RenderRules = {
  textgroup: (_node, children) => {
    return <SelectableBodyText>{children}</SelectableBodyText>;
  },
  link: (node, children) => {
    return (
      <Link target="_blank" rel="noopener noreferrer" href={node.attributes.href}>
        <Typography fontSize="sizeSm">{children}</Typography>
      </Link>
    );
  },
};

export const FormattedVideoDescription: FC<PropsWithChildren> = ({ children }) => {
  const { colors } = useTheme();

  return (
    <Markdown
      style={{
        bullet_list_icon: { color: colors.theme900 },
        bullet_list_content: { marginBottom: spacing.md },
        ordered_list_content: { marginBottom: spacing.md },
      }}
      markdownit={MarkdownIt({ linkify: true }).disable(["code"])}
      rules={formatterRules}
    >
      {children}
    </Markdown>
  );
};
