import { PropsWithChildren, useMemo } from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "@react-navigation/native";
import { fontFamilies, fontSizes, fontWeights, lineHeights, spacing } from "../theme";

export const Typography = (
  props: PropsWithChildren<
    TextProps & {
      color?: string;
      fontSize?: keyof typeof fontSizes;
      fontWeight?: keyof typeof fontWeights;
      hasOuterGlow?: boolean;
    }
  >,
) => {
  const { colors } = useTheme();

  const { fontSize, lineHeight } = useMemo(() => {
    if (!props.fontSize) {
      return { fontSize: fontSizes.sizeMd, lineHeight: lineHeights.sizeMd };
    }

    return { fontSize: fontSizes[props.fontSize], lineHeight: lineHeights[props.fontSize] };
  }, [props.fontSize]);

  const fontWeight = useMemo(() => {
    if (!props.fontWeight) {
      return fontWeights.Regular;
    }

    return fontWeights[props.fontWeight];
  }, [props.fontWeight]);

  return (
    <Text
      {...props}
      style={[
        {
          color: props.color ?? colors.text,
          fontSize,
          fontWeight,
          lineHeight,
          textShadowColor: props.hasOuterGlow ? colors.background : undefined,
          textShadowRadius: props.hasOuterGlow ? spacing.md : undefined,
          fontFamily: props.fontWeight ? `Inter_${fontWeight}${props.fontWeight}` : fontFamilies.Regular,
        },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
};
