import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getData, parseJsonString } from "../../utils";
import { DATAUSER } from "../../constants";

export default function Absen() {
  const [dataUser, setDataUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(DATAUSER);
        setDataUser(parseJsonString(data));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{dataUser?.data.pegawai.namaLengkap}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
