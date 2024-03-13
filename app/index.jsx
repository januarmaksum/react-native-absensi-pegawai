import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Button, HelperText, TextInput, Snackbar } from "react-native-paper";
import { DATAUSER, apiURL } from "../constants";
import { convertToJsonString, storeData } from "../utils";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [visibleError, setVisibleError] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    usernameError: "",
    passwordError: "",
  });

  const validateField = (name, value) => {
    if (value === "") {
      setErrors((prevState) => ({
        ...prevState,
        [`${name}Error`]: `${
          name.charAt(0).toUpperCase() + name.slice(1)
        } harus diisi`,
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        [`${name}Error`]: "",
      }));
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    const usernameError = formData.username === "" ? "Username harus diisi" : "";
    const passwordError = formData.password === "" ? "Password harus diisi" : "";

    setErrors({ usernameError, passwordError });

    if (usernameError || passwordError) {
      return;
    }

    const payload = {
      namaUser: formData.username,
      kataSandi: formData.password,
    };

    fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: convertToJsonString(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        handleStoreData(data);
        router.replace("/absen");
      })
      .catch(() => {
        setVisibleError(!visibleError);
      });
  };

  const handleStoreData = async (data) => {
    try {
      await storeData(DATAUSER, data);
    } catch (error) {
      console.error("Failed to store data:", error);
    }
  };

  const onDismissSnackBar = () => setVisibleError(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.wrapperForm}>
        <View>
          <TextInput
            label="Username"
            onChangeText={(text) => validateField("username", text)}
            value={formData.username}
            mode="outlined"
          />
          <HelperText type="error" style={styles.helper}>
            {errors.usernameError}
          </HelperText>
        </View>

        <View>
          <TextInput
            label="Password"
            onChangeText={(text) => validateField("password", text)}
            value={formData.password}
            secureTextEntry={!showPassword}
            mode="outlined"
            right={<TextInput.Icon onPress={handleShowPassword} icon="eye" />}
          />
          <HelperText type="error" style={styles.helper}>
            {errors.passwordError}
          </HelperText>
        </View>
        <Button
          style={styles.button}
          icon="login"
          mode="contained"
          uppercase
          onPress={handleLogin}
        >
          Login
        </Button>
      </View>

      <Snackbar
        visible={visibleError}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Tutup",
        }}
      >
        Username atau Password salah!
      </Snackbar>
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
  wrapperForm: {
    width: "100%",
    padding: 60,
  },
  button: {
    marginTop: 10,
  },
  input: {
    marginBottom: 28,
  },
  helper: {
    height: 28,
  },
});
