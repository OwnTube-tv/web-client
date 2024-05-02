import AsyncStorage from "@react-native-async-storage/async-storage";

export const writeToAsyncStorage = async (key: string, value: string) => {
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

export const deleteFromAsyncStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};
