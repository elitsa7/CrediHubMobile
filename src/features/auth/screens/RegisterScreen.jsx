import { useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import * as Linking from "expo-linking";

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

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);

  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      return "Моля, попълнете всички полета.";
    }

    const nameParts = trimmedName.split(/\s+/);

    if (nameParts.length < 3) {
      return "Моля, въведете собствено, бащино и фамилно име.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return "Моля, въведете валиден имейл адрес.";
    }

    const phoneRegex = /^(08[7-9]\d{7}|\+3598[7-9]\d{7})$/;

    if (!phoneRegex.test(phone.trim())) {
      return "Моля, въведете валиден български мобилен номер.";
    }

    if (password.length < 8) {
      return "Паролата трябва да е поне 8 символа.";
    }

    if (!/[A-ZА-Я]/.test(password)) {
      return "Паролата трябва да съдържа главна буква.";
    }

    if (!/[a-zа-я]/.test(password)) {
      return "Паролата трябва да съдържа малка буква.";
    }

    if (!/[0-9]/.test(password)) {
      return "Паролата трябва да съдържа цифра.";
    }

    return null;
  };
  const redirectTo = Linking.createURL("auth/callback");

  const handleRegister = async () => {
    setErrorMessage("");
    setEmailAlreadyExists(false);

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setIsLoading(true);
    try {
      console.info("[AUTH] Registration validation successful");
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });
      console.info("[AUTH] Signup response:", {
        hasUser: Boolean(data?.user),
        identitiesCount: data?.user?.identities?.length,
        hasSession: Boolean(data?.session),
      });

      if (error) {
        console.error("[AUTH] Registration failed:", error.message);

        if (
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("already exists")
        ) {
          setErrorMessage(
            "Този имейл вече има създаден профил. Влез в акаунта си.",
          );
          setEmailAlreadyExists(true);
        } else {
          setErrorMessage("Неуспешна регистрация. Опитайте отново.");
        }

        return;
      }

      console.info("[AUTH] Registration successful");

      setSuccessMessage(
        "Успешна регистрация! Изпратихме ти имейл с линк за потвърждение. Отвори го, за да активираш профила си.",
      );
    } catch (error) {
      console.error("[AUTH] Unexpected registration error:", error);

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

          <Text style={styles.subtitle}>Създай своя профил</Text>

          <TextInput
            style={styles.input}
            placeholder="Три имена"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Телефонен номер"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={13}
          />

          <TextInput
            style={styles.input}
            placeholder="Имейл"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Парола"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, isLoading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Регистрация..." : "Регистрация"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Вече имаш профил?</Text>

            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.loginLink}>Влез</Text>
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
      fontSize: 18,
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
    buttonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "bold",
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 25,
      gap: 5,
    },
    loginText: {
      color: "#10285C",
      fontSize: 14,
    },
    loginLink: {
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
    successText: {
      color: "#176B45",
      fontSize: 14,
      marginBottom: 12,
      marginLeft: 4,
      textAlign: "center",
    },
  });
};
