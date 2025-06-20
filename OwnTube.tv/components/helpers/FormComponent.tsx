import { PropsWithChildren } from "react";
import { Platform, View } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormComponent = ({ children, ...props }: PropsWithChildren<any>) => {
  return Platform.select({
    web: <form {...props}>{children}</form>,
    default: <View {...props}>{children}</View>,
  });
};
