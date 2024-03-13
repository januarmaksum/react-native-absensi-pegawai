export const convertToJsonString = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error("Error converting to JSON string:", error);
    throw error;
  }
};

export const parseJsonString = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON string:", error);
    throw error;
  }
};
