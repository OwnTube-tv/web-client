import { useState } from "react";
import * as Device from "expo-device";
import { DeviceType } from "expo-device";
import { Platform, useWindowDimensions } from "react-native";
import UAParser from "ua-parser-js";

export interface DeviceCapabilities {
  playerImplementation: string;
  deviceType: string;
  OS: string;
  browser: string | null;
  device: string | null;
  dimensions: string;
  orientation: "portrait" | "landscape";
}

export const useDeviceCapabilities = () => {
  const [playerImplementation, setPlayerImplementation] = useState("");
  const { height, width } = useWindowDimensions();

  const getBrowserInfo = () => {
    if (Platform.OS !== "web") {
      return null;
    }

    const { name, version } = new UAParser().getBrowser();
    return `${name} ${version}`;
  };

  const brandOrManufacturer = Device.brand || Device.manufacturer;

  const deviceCapabilities: DeviceCapabilities = {
    OS: `${Platform.OS === "android" ? "Android" : Device.osName} version ${Device.osVersion}`,
    dimensions: Platform.select({
      web: `${window?.screen?.width} x ${window?.screen?.height}`,
      default: `${Math.round(width)} x ${Math.round(height)}`,
    }),
    device: brandOrManufacturer ? `${brandOrManufacturer} ${Device.modelName}` : null,
    orientation: height > width ? "portrait" : "landscape",
    deviceType: Device.deviceType ? DeviceType[Device.deviceType] : "Unknown",
    browser: getBrowserInfo(),
    playerImplementation,
  };

  return { deviceCapabilities, setPlayerImplementation };
};
