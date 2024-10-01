import JSON5 from "json5";
import { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import { Platform } from "react-native";
import { readAsStringAsync } from "expo-file-system";
import { InstanceConfig } from "../instanceConfigs";

export const useFeaturedInstancesData = () => {
  const [featuredInstances, setFeaturedInstances] = useState<InstanceConfig[]>([]);

  const getFeaturedList = async () => {
    const [{ localUri }] = await Asset.loadAsync(require("../public/featured-instances.json5"));
    if (localUri) {
      if (Platform.OS === "web") {
        const config = await fetch(localUri).then((res) => res.text());
        return JSON5.parse<InstanceConfig[]>(config);
      } else {
        const config = await readAsStringAsync(localUri);
        return JSON5.parse<InstanceConfig[]>(config);
      }
    }
    return [];
  };

  useEffect(() => {
    getFeaturedList().then(setFeaturedInstances);
  }, []);

  return { featuredInstances };
};
