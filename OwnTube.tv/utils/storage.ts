import AsyncStorage from "@react-native-async-storage/async-storage";

export const writeToAsyncStorage = async (key: string, value: object | string) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
};

export const readFromAsyncStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return JSON.parse(value as string);
  } catch (error) {
    return false;
  }
};

export const deleteFromAsyncStorage = async (keys: string[]) => {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    return false;
  }
};

export const multiGetFromAsyncStorage = async (keys: string[]) => {
  try {
    return await AsyncStorage.multiGet(keys);
  } catch (error) {
    console.error(error);
  }
};
