import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../auth/context/AuthContext";
import { supabase } from "../../../lib/supabase";
import { useResponsive } from "../../../utils/responsive";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen() {
  const { isSmallPhone, horizontalPadding, cardPadding, moderateScale } =
    useResponsive();

  const styles = createStyles({
    isSmallPhone,
    horizontalPadding,
    cardPadding,
    moderateScale,
  });
  const { user } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [selectedAvatarUri, setSelectedAvatarUri] = useState(null);

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
          .select("full_name, phone, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setAvatarUrl(data.avatar_url || null);
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

  const handlePickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Необходим достъп",
          "Разреши достъп до галерията, за да избереш профилна снимка.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("[PROFILE] Image picker failed:", error.message);
      Alert.alert("Грешка", "Не успяхме да отворим галерията.");
    }
  };

  const uploadAvatar = async () => {
    if (!selectedAvatarUri) return avatarUrl;

    const filePath = `${user.id}/avatar-${Date.now()}.jpg`;

    const response = await fetch(selectedAvatarUri);
    const arrayBuffer = await response.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSave = async () => {
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    const nameParts = trimmedName.split(/\s+/);

    if (nameParts.length !== 3 || nameParts.some((part) => part.length < 2)) {
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

      let uploadedAvatarUrl = avatarUrl;

      if (selectedAvatarUri) {
        uploadedAvatarUrl = await uploadAvatar();
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: trimmedName,
          phone: trimmedPhone,
          avatar_url: uploadedAvatarUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      setAvatarUrl(uploadedAvatarUrl);
      setSelectedAvatarUri(null);

      Alert.alert("Успех", "Личните данни са обновени.", [
        {
          text: "Добре",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Грешка",
        error.message || "Не успяхме да запазим личните данни.",
      );
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
          <View style={styles.avatarSection}>
            <Pressable onPress={handlePickImage} style={styles.avatarButton}>
              {selectedAvatarUri || avatarUrl ? (
                <Image
                  source={{ uri: selectedAvatarUri || avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={42} color="#71809B" />
                </View>
              )}

              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={18} color="#FFFFFF" />
              </View>
            </Pressable>

            <Text style={styles.avatarText}>Промени профилната снимка</Text>
          </View>

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
      <View style={styles.footer}>
        <Ionicons name="lock-closed" size={15} color="#71809B" />
        <Text style={styles.footerText}>Твоите данни са защитени</Text>
      </View>
    </SafeAreaView>
  );
}
const createStyles = ({
  isSmallPhone,
  horizontalPadding,
  cardPadding,
  moderateScale,
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#bac8e0",
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: horizontalPadding,
      paddingTop: moderateScale(16),
      paddingBottom: 30,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(16),
      marginBottom: moderateScale(25),
    },
    title: {
      fontSize: moderateScale(isSmallPhone ? 23 : 26),
      fontWeight: "800",
      color: "#233D8B",
    },
    avatarSection: {
      alignItems: "center",
      marginBottom: 12,
    },
    avatarButton: {
      position: "relative",
    },
    avatar: {
      width: moderateScale(110),
      height: moderateScale(110),
      borderRadius: moderateScale(55),
    },
    avatarPlaceholder: {
      width: moderateScale(110),
      height: moderateScale(110),
      borderRadius: moderateScale(55),
      backgroundColor: "#E2E8F0",
      alignItems: "center",
      justifyContent: "center",
    },
    cameraIcon: {
      position: "absolute",
      right: 0,
      bottom: 0,
      backgroundColor: "#233D8B",
      width: moderateScale(34),
      height: moderateScale(34),
      borderRadius: moderateScale(17),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "#FFFFFF",
    },
    avatarText: {
      marginTop: 10,
      color: "#233D8B",
      fontWeight: "600",
      fontSize: moderateScale(13),
    },
    form: {
      backgroundColor: "#FFFFFF",
      padding: cardPadding,
      borderRadius: 18,
      gap: 12,
      width: "100%",
      maxWidth: 600,
      alignSelf: "center",
    },
    label: {
      fontSize: moderateScale(14),
      fontWeight: "700",
      color: "#233D8B",
    },
    input: {
      borderWidth: 1,
      borderColor: "#CBD5E1",
      borderRadius: 10,
      padding: moderateScale(13),
      fontSize: moderateScale(15),
      color: "#1E293B",
    },
    saveButton: {
      backgroundColor: "#233D8B",
      borderRadius: 12,
      padding: moderateScale(15),
      alignItems: "center",
      marginTop: 12,
    },
    saveText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: moderateScale(15),
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      paddingVertical: 16,
      backgroundColor: "#bac8e0",
    },
    footerText: {
      color: "#71809B",
      fontSize: moderateScale(12),
    },
  });
