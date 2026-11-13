import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../features/auth/context/AuthContext";
import { ActivityIndicator, View } from "react-native";

export default function AuthLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#10285C" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
