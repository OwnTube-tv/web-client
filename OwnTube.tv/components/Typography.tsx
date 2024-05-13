import { PropsWithChildren } from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "@react-navigation/native";
import { typography } from "../src/styles/typography";

export const Typography = (
  props: PropsWithChildren<
    TextProps & {
      color?: string;
      fontSize?: number;
    }
  >,
) => {
  const color = useTheme().colors.text;

  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          color: props.color ?? color,
          fontSize: props.fontSize || typography.size.M,
        },
      ]}
    >
      {props.children}
    </Text>
  );
};
