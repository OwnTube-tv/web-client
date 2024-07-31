import { PropsWithChildren } from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "@react-navigation/native";
import { fontFamilies, typography } from "../theme";

export const Typography = (
  props: PropsWithChildren<
    TextProps & {
      color?: string;
      fontSize?: number;
      hasOuterGlow?: boolean;
    }
  >,
) => {
  const { colors } = useTheme();

  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          color: props.color ?? colors.text,
          fontSize: props.fontSize || typography.size.M,
          textShadowColor: props.hasOuterGlow ? colors.background : undefined,
          textShadowRadius: props.hasOuterGlow ? 10 : undefined,
          fontFamily: fontFamilies.regular,
        },
      ]}
    >
      {props.children}
    </Text>
  );
};
