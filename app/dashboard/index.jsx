import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator, View } from "react-native";
import useUserStore from "../../store/userStore";

const Dashboard = () => {
  const user = useUserStore((state) => state.user);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.token) {
      fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setProfileData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setIsLoading(false);
        });
    }
  }, [user]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!profileData) {
    return <Text>Error fetching user profile</Text>;
  }

  return (
    <View className='flex-1 justify-center items-center'>
      <Text>Welcome, {profileData.firstName}!</Text>
      <Text>Welcome, {profileData.email}!</Text>
    </View>
  );
};

export default Dashboard;
