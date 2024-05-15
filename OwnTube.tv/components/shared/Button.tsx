import { PropsWithChildren, FC } from "react";
import { ViewStyle, Pressable, PressableProps } from "react-native";

interface ButtonProps extends PropsWithChildren<PressableProps> {
  style?: ViewStyle | ViewStyle[];
}

export const Button: FC<ButtonProps> = ({ children, style, ...props }) => (
  <Pressable {...props} style={({ pressed }) => [style, { opacity: pressed ? 0.5 : 1 }]}>
    {children}
  </Pressable>
);
