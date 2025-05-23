import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { focusManager } from "@tanstack/react-query";

export const useCustomFocusManager = () => {
  const isFocused = useIsFocused();

  useEffect(() => {
    focusManager.setFocused(isFocused);
  }, [isFocused]);
};
