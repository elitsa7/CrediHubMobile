import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../auth/context/AuthContext";
import { supabase } from "../../../lib/supabase";
import { useState } from "react";
import { useResponsive } from "../../../utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SecurityScreen() {
  const {
    isSmallPhone,
    horizontalPadding,
    cardPadding,
    moderateScale,
    sectionGap,
  } = useResponsive();

  const styles = createStyles({
    isSmallPhone,
    horizontalPadding,
    cardPadding,
    moderateScale,
    sectionGap,
  });

  const { user } = useAuth();
  const router = useRouter();

  const [newEmail, setNewEmail] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdateEmail = async () => {
    const trimmedEmail = newEmail.trim();

    if (!trimmedEmail) {
      Alert.alert("Грешка", "Моля, въведи нов имейл адрес.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Грешка", "Въведи валиден имейл адрес.");
      return;
    }

    if (trimmedEmail.toLowerCase() === user?.email?.toLowerCase()) {
      Alert.alert("Грешка", "Това е текущият ти имейл адрес.");
      return;
    }

    try {
      setIsUpdatingEmail(true);

      const { error } = await supabase.auth.updateUser({
        email: trimmedEmail,
      });

      if (error) throw error;

      Alert.alert(
        "Потвърждение",
        "Изпратихме имейл за потвърждение. Провери новата си поща и следвай линка.",
      );

      setNewEmail("");
    } catch (error) {
      console.error("[SECURITY] Email update failed:", error.message);
      const message = error.message.includes("For security purposes")
        ? "Изпратена е скорошна заявка. Моля, изчакай малко и опитай отново."
        : error.message;
      Alert.alert("Грешка", message);
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Грешка", "Моля, попълни всички полета.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Невалидна парола", "Паролата трябва да е поне 8 символа.");
      return;
    }

    if (!/[A-ZА-Я]/.test(newPassword)) {
      Alert.alert(
        "Невалидна парола",
        "Паролата трябва да съдържа главна буква.",
      );
      return;
    }

    if (!/[a-zа-я]/.test(newPassword)) {
      Alert.alert(
        "Невалидна парола",
        "Паролата трябва да съдържа малка буква.",
      );
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      Alert.alert("Невалидна парола", "Паролата трябва да съдържа цифра.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Грешка", "Новите пароли не съвпадат.");
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert("Грешка", "Новата парола трябва да е различна от текущата.");
      return;
    }

    if (!user?.email) {
      Alert.alert("Грешка", "Не успяхме да намерим имейла на профила.");
      return;
    }

    try {
      setIsUpdatingPassword(true);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Текущата парола е неправилна.");
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Alert.alert("Успех", "Паролата е променена успешно.");
    } catch (error) {
      console.error("[SECURITY] Password update failed:", error.message);
      Alert.alert("Грешка", error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#233D8B" />
              </Pressable>

              <View style={styles.headerText}>
                <Text style={styles.title}>Сигурност</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={27}
                  color="#233D8B"
                />
              </View>

              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Защити своя профил</Text>
                <Text style={styles.infoDescription}>
                  Поддържай данните си актуални и използвай сигурна парола.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionHeading}>ДАННИ ЗА ДОСТЪП</Text>

            <View style={styles.settingsCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Ionicons name="mail-outline" size={22} color="#233D8B" />
                </View>

                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Имейл адрес</Text>
                  <Text style={styles.settingValue} numberOfLines={1}>
                    {user?.email}
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    setShowEmailForm(!showEmailForm);
                    setShowPasswordForm(false);
                  }}
                  disabled={isUpdatingEmail}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>
                    {showEmailForm ? "Затвори" : "Промени"}
                  </Text>
                </Pressable>
              </View>

              {showEmailForm && (
                <View style={styles.form}>
                  <Text style={styles.label}>Нов имейл адрес</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Въведи нов имейл"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={newEmail}
                    onChangeText={setNewEmail}
                    editable={!isUpdatingEmail}
                  />

                  <Pressable
                    style={styles.primaryButton}
                    onPress={handleUpdateEmail}
                    disabled={isUpdatingEmail}
                  >
                    {isUpdatingEmail ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.primaryButtonText}>
                        Запази новия имейл
                      </Text>
                    )}
                  </Pressable>
                </View>
              )}

              <View style={styles.separator} />

              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#233D8B"
                  />
                </View>

                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Парола</Text>
                  <Text style={styles.settingValue}>Промени паролата си</Text>
                </View>

                <Pressable
                  style={styles.actionButton}
                  onPress={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setShowEmailForm(false);
                  }}
                >
                  <Text style={styles.actionText}>
                    {showPasswordForm ? "Затвори" : "Промени"}
                  </Text>
                </Pressable>
              </View>

              {showPasswordForm && (
                <View style={styles.form}>
                  <Text style={styles.label}>Текуща парола</Text>

                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Въведи текущата парола"
                      secureTextEntry={!showCurrentPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      editable={!isUpdatingPassword}
                    />

                    <Pressable
                      onPress={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={
                          showCurrentPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={22}
                        color="#71809B"
                      />
                    </Pressable>
                  </View>

                  <Text style={styles.label}>Нова парола</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Въведи нова парола"
                      secureTextEntry={!showNewPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      editable={!isUpdatingPassword}
                    />

                    <Pressable
                      onPress={() => setShowNewPassword(!showNewPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={
                          showNewPassword ? "eye-off-outline" : "eye-outline"
                        }
                        size={22}
                        color="#71809B"
                      />
                    </Pressable>
                  </View>
                  <Text style={styles.label}>Повтори новата парола</Text>

                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Повтори новата парола"
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      editable={!isUpdatingPassword}
                    />

                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={22}
                        color="#71809B"
                      />
                    </Pressable>
                  </View>

                  <Text style={styles.passwordHint}>
                    Минимум 8 символа, главна и малка буква и цифра.
                  </Text>

                  <Pressable
                    style={styles.primaryButton}
                    onPress={handleUpdatePassword}
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.primaryButtonText}>
                        Запази новата парола
                      </Text>
                    )}
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  sectionGap,
}) =>
  StyleSheet.create({
    mainContent: {
      gap: sectionGap,
    },
    keyboardArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: "#bac8e0",
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: horizontalPadding,
      paddingTop: moderateScale(16),
      paddingBottom: moderateScale(30),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(16),
      marginBottom: 5,
    },
    title: {
      fontSize: moderateScale(isSmallPhone ? 22 : 25),
      fontWeight: "800",
      color: "#233D8B",
      flexShrink: 1,
    },
    backButton: {
      padding: 5,
    },
    headerText: {
      flex: 1,
      gap: 3,
      minWidth: 0,
    },
    infoBox: {
      backgroundColor: "#233D8B",
      borderRadius: 18,
      padding: cardPadding,
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(14),
      marginBottom: moderateScale(30),
    },
    infoIcon: {
      width: moderateScale(48),
      height: moderateScale(48),
      borderRadius: 15,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    infoText: {
      flex: 1,
      gap: 5,
      minWidth: 0,
    },
    infoTitle: {
      color: "#FFFFFF",
      fontSize: moderateScale(16),
      fontWeight: "700",
      flexShrink: 1,
    },
    infoDescription: {
      color: "#DCE5FA",
      fontSize: moderateScale(12),
      lineHeight: moderateScale(18),
      flexShrink: 1,
    },
    sectionHeading: {
      color: "#52627D",
      fontSize: moderateScale(12),
      fontWeight: "800",
      letterSpacing: 1,
      marginBottom: 12,
      marginLeft: 4,
    },
    settingsCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      paddingHorizontal: cardPadding,
      paddingVertical: 5,
    },
    separator: {
      height: 1,
      backgroundColor: "#E9EDF4",
      marginLeft: moderateScale(56),
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: moderateScale(17),
      gap: moderateScale(12),
    },
    settingIcon: {
      width: moderateScale(44),
      height: moderateScale(44),
      borderRadius: 14,
      backgroundColor: "#EAF0FC",
      alignItems: "center",
      justifyContent: "center",
    },
    settingInfo: {
      flex: 1,
      gap: 5,
      minWidth: 0,
    },
    settingTitle: {
      fontSize: moderateScale(15),
      fontWeight: "700",
      color: "#233D8B",
      flexShrink: 1,
    },
    settingValue: {
      fontSize: moderateScale(12),
      color: "#71809B",
      flexShrink: 1,
    },
    actionButton: {
      paddingVertical: 9,
      paddingHorizontal: 10,
    },
    actionText: {
      fontSize: moderateScale(13),
      fontWeight: "700",
      color: "#3157B7",
    },
    form: {
      paddingTop: 5,
      paddingBottom: 20,
      gap: 10,
    },
    label: {
      fontSize: moderateScale(13),
      fontWeight: "600",
      color: "#52627D",
      marginTop: 5,
    },
    input: {
      backgroundColor: "#F5F7FB",
      borderWidth: 1,
      borderColor: "#E1E7F1",
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: moderateScale(14),
      color: "#233D8B",
    },
    primaryButton: {
      backgroundColor: "#233D8B",
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 5,
    },
    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: moderateScale(14),
      fontWeight: "700",
    },
    passwordInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F7FB",
      borderWidth: 1,
      borderColor: "#E1E7F1",
      borderRadius: 12,
    },
    passwordInput: {
      flex: 1,
      minWidth: 0,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: moderateScale(14),
      color: "#233D8B",
    },
    eyeButton: {
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    passwordHint: {
      fontSize: moderateScale(11),
      lineHeight: moderateScale(16),
      color: "#71809B",
      marginTop: 2,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      paddingVertical: 16,
      paddingHorizontal: horizontalPadding,
      backgroundColor: "#bac8e0",
    },
    footerText: {
      color: "#71809B",
      fontSize: moderateScale(12),
      flexShrink: 1,
      textAlign: "center",
    },
  });
