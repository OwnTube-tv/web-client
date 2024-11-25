import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Settings } from "react-native";

export const writeToAsyncStorage = async (key: string, value: object | string) => {
  try {
    if (Platform.isTVOS) {
      Settings.set({ [key]: JSON.stringify(value) });
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(error);
  }
};

export const readFromAsyncStorage = async (key: string) => {
  try {
    const value = Platform.isTVOS ? Settings.get(key) || null : await AsyncStorage.getItem(key);
    return JSON.parse(value as string);
  } catch (error) {
    console.error(error);
  }
};

export const deleteFromAsyncStorage = async (keys: string[]) => {
  try {
    if (Platform.isTVOS) {
      keys.forEach((key: string) => {
        Settings.set({ [key]: "" });
      });
    } else {
      await AsyncStorage.multiRemove(keys);
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const multiGetFromAsyncStorage = async (keys: string[]) => {
  try {
    if (Platform.isTVOS) {
      return keys.map((key: string) => {
        return [key, Settings.get(key)];
      });
    } else {
      return await AsyncStorage.multiGet(keys);
    }
  } catch (error) {
    console.error(error);
  }
};
