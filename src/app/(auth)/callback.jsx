import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const { code } = useLocalSearchParams();
  useEffect(() => {
    const handleCallback = async () => {
      console.info("[AUTH] Email confirmation callback received");

      try {
        if (!code) {
          throw new Error("Authorization code not found");
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          throw error;
        }

        console.info("[AUTH] Email confirmation successful");
        router.replace("/dashboard");
      } catch (error) {
        console.error("[AUTH] Callback failed:", error.message);
        router.replace("/login");
      }
    };

    handleCallback();
  }, [code, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <ActivityIndicator size="large" color="#10285C" />
      <Text style={{ marginTop: 16 }}>Потвърждаваме имейла...</Text>
    </View>
  );
}
