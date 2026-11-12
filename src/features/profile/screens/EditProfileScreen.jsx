import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../auth/context/AuthContext";
import { supabase } from "../../../lib/supabase";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const styles = createStyles(width);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setFullName(data.full_name || "");
        setPhone(data.phone || "");
      } catch (error) {
        console.error("[PROFILE] Failed to load:", error.message);
        setError("Не успяхме да заредим личните данни.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const handleSave = async () => {
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    const nameParts = trimmedName.split(/\s+/);
    if (
      trimmedName.split(/\s+/).length !== 3 ||
      nameParts.some((part) => part.length < 2)
    ) {
      Alert.alert("Невалидно име", "Моля, въведете трите си имена.");
      return;
    }

    const phoneRegex = /^(08[7-9]\d{7}|\+3598[7-9]\d{7})$/;
    if (!phoneRegex.test(trimmedPhone)) {
      Alert.alert(
        "Невалиден телефон",
        "Моля, въведете валиден български мобилен номер.",
      );
      return;
    }

    try {
      setIsSaving(true);

      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: trimmedName,
          phone: trimmedPhone,
        })
        .eq("id", user.id)
        .select("full_name, phone")
        .single();

      if (error) throw error;
      console.log("[PROFILE] Updated data:", data);

      Alert.alert("Успех", "Личните данни са обновени.", [
        {
          text: "Добре",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("[PROFILE] Failed to update:", error.message);
      Alert.alert("Грешка", "Не успяхме да запазим личните данни.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#233D8B" />
        <Text>Зареждане на личните данни...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
        <Pressable onPress={() => router.back()}>
          <Text>Назад</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#233D8B" />
          </Pressable>
          <Text style={styles.title}>Лични данни</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Три имена</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Въведете трите си имена"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Телефон</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Въведете телефон"
            keyboardType="phone-pad"
            maxLength={13}
          />

          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>Запази промените</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#bac8e0",
    },
    content: {
      flexGrow: 1,
      padding: width * 0.05,
      paddingBottom: 30,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginBottom: 25,
    },
    title: {
      fontSize: width < 380 ? 23 : 26,
      fontWeight: "800",
      color: "#233D8B",
    },
    form: {
      backgroundColor: "#FFFFFF",
      padding: width < 380 ? 16 : 22,
      borderRadius: 18,
      gap: 12,
      width: "100%",
      maxWidth: 600,
      alignSelf: "center",
    },
    label: {
      fontSize: 14,
      fontWeight: "700",
      color: "#233D8B",
    },
    input: {
      borderWidth: 1,
      borderColor: "#CBD5E1",
      borderRadius: 10,
      padding: 13,
      fontSize: 15,
      color: "#1E293B",
    },
    saveButton: {
      backgroundColor: "#233D8B",
      borderRadius: 12,
      padding: 15,
      alignItems: "center",
      marginTop: 12,
    },
    saveText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 15,
    },
  });
