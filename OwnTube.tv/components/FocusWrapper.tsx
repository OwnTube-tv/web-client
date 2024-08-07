import { FC, PropsWithChildren } from "react";
import { useIsFocused } from "@react-navigation/native";

export const FocusWrapper: FC<PropsWithChildren> = ({ children }) => {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return <>{children}</>;
};
