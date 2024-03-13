import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
  try {
    if (typeof value === "string") {
      await AsyncStorage.setItem(key, value);
    } else {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    }
  } catch (error) {
    console.error("Error storing data:", error);
    throw error;
  }
};

export const getData = async (key) => {
  try {
    const storedValue = await AsyncStorage.getItem(key);
    if (!storedValue) {
      return null;
    }

    return storedValue;
  } catch (error) {
    console.error("Error reading data:", error);
    throw error;
  }
};
