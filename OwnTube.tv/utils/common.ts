import { VideoStatsUserAgentDevice } from "@peertube/peertube-types";
import { DeviceType } from "expo-device";

export const capitalize = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const getAvailableVidsString = (count?: number) => {
  return ` (${count ?? "?"})`;
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const bytesPerUnit = 1024;
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(bytesPerUnit));

  const size = (bytes / Math.pow(bytesPerUnit, unitIndex)).toFixed(1).replace(".0", "");

  return `${size} ${units[unitIndex]}`;
}

export const getDeviceTypeForVideoView = (deviceType: DeviceType | null): VideoStatsUserAgentDevice | undefined => {
  if (deviceType === DeviceType.UNKNOWN || deviceType === null) {
    return;
  }

  return (
    {
      [DeviceType.PHONE]: "mobile",
      [DeviceType.TABLET]: "tablet",
      [DeviceType.DESKTOP]: "desktop",
      [DeviceType.TV]: "smarttv",
    } as const
  )[deviceType];
};
