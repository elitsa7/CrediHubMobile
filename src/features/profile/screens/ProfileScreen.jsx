import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../auth/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../lib/supabase";
import { useCallback, useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const displayName = profile?.full_name || "Потребител";
  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name[0].toUpperCase())
    .filter((_, index, array) => index === 0 || index === array.length - 1)
    .join("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0);
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProfile = async () => {
        try {
          setIsLoading(true);
          setError(null);

          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", user?.id)
            .single();

          if (error) throw error;

          if (isActive) {
            setProfile(data);
            setError(null);
          }
        } catch (error) {
          console.error("[PROFILE] Failed to load:", error.message);

          if (isActive) {
            setError("Не успяхме да заредим профила.");
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      if (user?.id) {
        loadProfile();
      }

      return () => {
        isActive = false;
      };
    }, [user?.id, reload]),
  );

  const handleLogout = () => {
    Alert.alert("Изход от профила", "Сигурни ли сте, че искате да излезете?", [
      {
        text: "Отказ",
        style: "cancel",
      },
      {
        text: "Изход",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("[PROFILE] Failed to logout:", error.message);
            Alert.alert("Грешка.", "Неуспешно излизане от профила.");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#233D8B" />
          <Text style={styles.loadingText}>Зареждане на профила...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#DC2626" />

          <Text style={styles.loadingText}>{error}</Text>

          <Text
            style={styles.retryButton}
            onPress={() => setReload((previous) => previous + 1)}
          >
            Опитай отново
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Моят профил</Text>
        <Pressable style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>{initials}</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {displayName}
              </Text>
              <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
                {user?.email}
              </Text>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <Ionicons name="phone-portrait-outline" size={18} color="#64748B" />
            <Text style={styles.phone}>
              {profile?.phone || "Няма добавен телефон"}
            </Text>
          </View>
        </Pressable>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Моят акаунт</Text>
          <View style={styles.menuGroup}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/edit-profile")}
            >
              <Ionicons name="person-outline" size={22} color="#233D8B" />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Лични данни</Text>
                <Text style={styles.menuDescription}>
                  Управление на личната информация
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/security")}
            >
              <Ionicons name="lock-closed-outline" size={22} color="#233D8B" />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Сигурност и парола</Text>
                <Text style={styles.menuDescription}>
                  Управление на сигурността и паролата
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View style={styles.logoutSection}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={21} color="#DC2626" />
          <Text style={styles.logoutText}>Изход от профила</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#bac8e0",
      paddingHorizontal: width < 380 ? 16 : width < 600 ? 24 : 32,
      paddingTop: width < 380 ? 16 : 20,
    },
    title: {
      fontSize: width < 380 ? 23 : 26,
      fontWeight: "800",
      color: "#233D8B",
      marginBottom: width < 380 ? 18 : 24,
    },
    profileCard: {
      backgroundColor: "#FFFFFF",
      padding: width < 380 ? 16 : 20,
      borderRadius: width < 380 ? 16 : 20,
      marginBottom: width < 380 ? 20 : 24,
      width: "100%",
      maxWidth: 600,
      alignSelf: "center",
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: width < 380 ? 10 : 14,
    },
    avatar: {
      width: width < 380 ? 54 : 64,
      height: width < 380 ? 54 : 64,
      borderRadius: width < 380 ? 27 : 32,
      backgroundColor: "#E8EEFF",
      justifyContent: "center",
      alignItems: "center",
    },
    initials: {
      fontSize: width < 380 ? 17 : 20,
      fontWeight: "800",
      color: "#233D8B",
    },
    profileInfo: {
      flex: 1,
      gap: 4,
      minWidth: 0,
    },
    profileDetails: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 16,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: "#E8EEFF",
    },
    phone: {
      fontSize: width < 380 ? 12 : 14,
      color: "#64748B",
    },
    section: {
      marginTop: width < 380 ? 8 : 12,
      width: "100%",
      maxWidth: 600,
      alignSelf: "center",
    },
    sectionTitle: {
      fontSize: width < 380 ? 16 : 18,
      fontWeight: "700",
      color: "#233D8B",
      marginBottom: width < 380 ? 10 : 12,
    },
    menuItem: {
      backgroundColor: "#FFFFFF",
      padding: width < 380 ? 14 : 18,
      borderRadius: width < 380 ? 12 : 14,
      flexDirection: "row",
      alignItems: "center",
    },
    menuText: {
      flex: 1,
      marginLeft: width < 380 ? 10 : 14,
    },
    menuTitle: {
      fontSize: width < 380 ? 14 : 15,
      fontWeight: "600",
      color: "#233D8B",
    },
    menuDescription: {
      fontSize: width < 380 ? 11 : 12,
      color: "#64748B",
      marginTop: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 12,
      fontSize: width < 380 ? 13 : 14,
      color: "#233D8B",
    },
    retryButton: {
      marginTop: 18,
      fontSize: 15,
      fontWeight: "700",
      color: "#233D8B",
      padding: 10,
    },
    menuGroup: {
      backgroundColor: "#FFFFFF",
      borderRadius: width < 380 ? 12 : 14,
      overflow: "hidden",
    },
    menuDivider: {
      height: 1,
      backgroundColor: "#E8EEFF",
      marginHorizontal: width < 380 ? 14 : 18,
    },
    logoutSection: {
      marginTop: "auto",
      paddingTop: 16,
      paddingBottom: 12,
    },
    logoutButton: {
      backgroundColor: "#FFFFFF",
      padding: width < 380 ? 14 : 18,
      borderRadius: width < 380 ? 12 : 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      borderWidth: 1,
      borderColor: "#FECACA",
    },
    logoutText: {
      color: "#DC2626",
      fontSize: width < 380 ? 14 : 15,
      fontWeight: "700",
    },
  });
