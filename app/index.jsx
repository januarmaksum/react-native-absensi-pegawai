import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { Button, HelperText, TextInput, Snackbar } from "react-native-paper";
import useUserStore from "../store/userStore";
import { router } from "expo-router";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(false);
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
        } cannot be empty`,
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
    const usernameError =
      formData.username === "" ? "Username cannot be empty" : "";
    const passwordError =
      formData.password === "" ? "Password cannot be empty" : "";

    setErrors({ usernameError, passwordError });

    if (usernameError || passwordError) {
      return;
    }

    // const payload = {
    //   namaUser: formData.username,
    //   kataSandi: formData.password,
    // };
    const payload = {
      username: formData.username,
      password: formData.password,
    };

    fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        // console.log("response: ", response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Login successful:", data);
        useUserStore.setState({ user: data });
        router.replace("/dashboard");
      })
      .catch((error) => {
        // console.error("Error during login:", error);
        setVisible(!visible);
      });
  };

  const onDismissSnackBar = () => setVisible(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <StatusBar style="auto" />
      <View className="p-6 w-full gap-3">
        <View>
          <TextInput
            label="Username"
            onChangeText={(text) => validateField("username", text)}
            value={formData.username}
            mode="outlined"
          />
          {errors.usernameError ? (
            <HelperText type="error">{errors.usernameError}</HelperText>
          ) : null}
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
          {errors.passwordError ? (
            <HelperText type="error">{errors.passwordError}</HelperText>
          ) : null}
        </View>
        <Button
          className="mt-2"
          icon="login"
          mode="contained"
          uppercase
          onPress={handleLogin}
        >
          Login
        </Button>
      </View>

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Close",
        }}
      >
        Username atau Password salah!
      </Snackbar>
    </View>
  );
}
