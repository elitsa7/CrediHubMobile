import { useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const router = useRouter();

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email.trim()) {
      console.warn("[AUTH] Email is empty");
      setErrorMessage("Моля, въведете имейл.");
      return;
    }

    if (!password) {
      console.warn("[AUTH] Password is empty");
      setErrorMessage("Моля, въведете парола.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("[AUTH] Login failed:", error.message);
        setErrorMessage("Имейлът или паролата са неправилни.");
        return;
      }
      console.info("[AUTH] Login successful");
    } catch (error) {
      console.error("[AUTH] Unexpected login error:", error);

      setErrorMessage("Възникна проблем с връзката. Опитайте отново.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>CrediHub</Text>

          <Text style={styles.subtitle}>Добре дошли отново!</Text>

          <TextInput
            style={styles.input}
            placeholder="Имейл:"
            placeholderTextColor="#BDBDBD"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Парола:"
            placeholderTextColor="#BDBDBD"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Влизане..." : "Вход"}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Нямаш профил?</Text>

            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.registerLink}>Регистрирай се</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (width, height) => {
  const horizontalPadding = width < 380 ? 16 : width < 600 ? 24 : 40;

  return StyleSheet.create({
    keyboardContainer: {
      flex: 1,
      backgroundColor: "#BAC8E0",
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: horizontalPadding,
      paddingVertical: height < 700 ? 24 : 40,
    },
    title: {
      fontSize: width < 380 ? 30 : 34,
      fontWeight: "bold",
      color: "#10285C",
      textAlign: "center",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: width < 380 ? 16 : 18,
      textAlign: "center",
      marginBottom: 35,
      color: "#10285C",
    },
    input: {
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      fontSize: 16,
    },
    button: {
      backgroundColor: "#10285C",
      padding: 17,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 10,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "bold",
    },
    registerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 25,
      gap: 5,
    },
    registerText: {
      color: "#10285C",
      fontSize: 14,
    },
    registerLink: {
      color: "#2457B5",
      fontSize: 14,
      fontWeight: "bold",
      textDecorationLine: "underline",
    },
    errorText: {
      color: "#D32F2F",
      fontSize: 14,
      marginBottom: 12,
      marginLeft: 4,
    },
  });
};
