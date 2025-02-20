import { useMemo } from "react";
import build_info from "../build-info.json";
import { useGlobalSearchParams, usePathname } from "expo-router";

export const useVideoLink = ({
  isTimestampAdded,
  addedTimestamp = 0,
}: {
  isTimestampAdded: boolean;
  addedTimestamp?: number;
}) => {
  const params = useGlobalSearchParams();
  const pathname = usePathname();

  return useMemo(() => {
    const paramsCopy = { ...params };
    delete paramsCopy.timestamp;
    return `${build_info.WEB_URL?.toLowerCase()}${pathname}?${new URLSearchParams(paramsCopy as Record<string, string>)}${isTimestampAdded ? `&timestamp=${addedTimestamp}` : ""}`;
  }, [isTimestampAdded, pathname, params, addedTimestamp]);
};
