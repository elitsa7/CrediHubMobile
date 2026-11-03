import { Redirect } from "expo-router";
import { useAuth } from "../features/auth/context/AuthContext";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#10285C" />
      </View>
    );
  }

  return <Redirect href={session ? "/dashboard" : "/login"} />;
}
