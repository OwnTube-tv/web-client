import { useState } from "react";
import * as Device from "expo-device";
import { DeviceType } from "expo-device";
import { Platform, useWindowDimensions } from "react-native";
import UAParser from "ua-parser-js";
import { capitalize } from "../utils";
import { useTranslation } from "react-i18next";

export interface DeviceCapabilities {
  playerImplementation: string;
  deviceType: string;
  OS: string;
  browser: string | null;
  device: string | null;
  dimensions: string;
  orientation: string;
}

export const useDeviceCapabilities = () => {
  const { t } = useTranslation();
  const [playerImplementation, setPlayerImplementation] = useState(capitalize(Platform.OS));
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
    OS: `${Platform.OS === "android" ? t("android") : Device.osName} ${t("version")} ${Device.osVersion}`,
    dimensions: Platform.select({
      web: `${window?.screen?.width} x ${window?.screen?.height}`,
      default: `${Math.round(width)} x ${Math.round(height)}`,
    }),
    device: brandOrManufacturer ? `${brandOrManufacturer} ${Device.modelName}` : null,
    orientation: height > width ? t("portrait") : t("landscape"),
    deviceType: Device.deviceType ? DeviceType[Device.deviceType] : t("unknown"),
    browser: getBrowserInfo(),
    playerImplementation: Platform.select({
      web: `${t("web")} video.js`,
      default: playerImplementation,
    }),
  };

  return { deviceCapabilities, setPlayerImplementation };
};
