import {
  View,
  Text,
  Pressable,
  TextInput,
  useWindowDimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../auth/context/AuthContext";
import { supabase } from "../../../lib/supabase";

export default function ApplyScreen() {
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const params = useLocalSearchParams();
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const loan = {
    amount: Number(params.amount),
    months: Number(params.months),
    annualRate: Number(params.annualRate),
    monthlyPayment: Number(params.monthlyPayment),
  };
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    email: user?.email || "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const renderSteps = () => {
    const steps = ["Данни", "Преглед", "Изпращане"];

    return (
      <View style={styles.stepper}>
        <View style={styles.stepsRow}>
          {steps.map((label, index) => {
            const number = index + 1;
            const isActive = step === number;
            const isCompleted = step > number;

            return (
              <View key={label} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    (isActive || isCompleted) && styles.stepCircleActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      (isActive || isCompleted) && styles.stepNumberActive,
                    ]}
                  >
                    {isCompleted ? "✓" : number}
                  </Text>
                </View>

                <Text
                  style={[styles.stepLabel, isActive && styles.stepLabelActive]}
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${((step - 1) / 2) * 100}%` },
            ]}
          />
        </View>
      </View>
    );
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile({
          fullName: data.full_name || "",
          phone: data.phone || "",
          email: user.email || "",
        });
      } catch (error) {
        console.error("[APPLICATION] Profile loading failed:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#233D8B" />
          </Pressable>
          <View style={styles.stepperContainer}>{renderSteps()}</View>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Лични данни</Text>

          <Text style={styles.inputLabel}>Три имена</Text>
          <Text style={styles.readOnlyInput}>
            {profile.fullName || "Няма въведени имена"}
          </Text>

          <Text style={styles.inputLabel}>Телефон</Text>
          <Text style={styles.readOnlyInput}>
            {profile.phone || "Няма въведен телефон"}
          </Text>

          <Text style={styles.inputLabel}>Имейл</Text>
          <Text style={styles.readOnlyInput}>
            {profile.email || "Няма въведен имейл"}
          </Text>
        </View>

        <View style={styles.loanCard}>
          <Text style={styles.loanCardTitle}>Параметри на кредита</Text>

          <View style={styles.loanRow}>
            <Text style={styles.loanLabel}>Желана сума</Text>
            <Text style={styles.loanValue}>{loan.amount.toFixed(2)} €</Text>
          </View>

          <View style={styles.loanRow}>
            <Text style={styles.loanLabel}>Срок</Text>
            <Text style={styles.loanValue}>{loan.months} месеца</Text>
          </View>

          <View style={styles.loanRow}>
            <Text style={styles.loanLabel}>Годишна лихва</Text>
            <Text style={styles.loanValue}>{loan.annualRate.toFixed(2)} %</Text>
          </View>

          <View style={[styles.loanRow, styles.loanRowLast]}>
            <Text style={[styles.loanLabel, styles.monthlyPaymentLabel]}>
              Месечна вноска
            </Text>
            <Text style={[styles.loanValue, styles.monthlyPaymentValue]}>
              {loan.monthlyPayment.toFixed(2)} €
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Финансова информация</Text>

          <Text style={styles.label}>Месечен доход (нето)</Text>

          <TextInput
            style={styles.input}
            placeholder="Например 1500"
            keyboardType="decimal-pad"
            value={monthlyIncome}
            onChangeText={setMonthlyIncome}
          />

          <Text style={styles.label}>Месторабота</Text>

          <TextInput
            style={styles.input}
            placeholder="Име на работодателя"
            value={workplace}
            onChangeText={setWorkplace}
          />

          <Text style={styles.label}>Вид заетост</Text>

          <View style={styles.employmentOptions}>
            {[
              "Трудов договор",
              "Самоосигуряващо се лице",
              "Граждански договор",
              "Безработен",
            ].map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.employmentOption,
                  employmentType === option && styles.employmentOptionActive,
                ]}
                onPress={() => setEmploymentType(option)}
              >
                <Ionicons
                  name={
                    employmentType === option
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color="#233D8B"
                />
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#BAC8E0",
    },
    scrollContent: {
      paddingHorizontal: 18,
      paddingTop: 4,
      paddingBottom: 30,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gao: 12,
      marginBottom: 0,
    },
    stepperContainer: {
      flex: 1,
    },
    stepper: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "transparent",
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    stepsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    stepItem: {
      flex: 1,
      alignItems: "center",
      gap: 4,
    },
    stepCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "#E8EDF5",
      justifyContent: "center",
      alignItems: "center",
    },
    stepCircleActive: {
      backgroundColor: "#233D8B",
    },
    stepNumber: {
      color: "#64748B",
      fontWeight: "700",
      fontSize: 13,
    },
    stepNumberActive: {
      color: "#FFFFFF",
    },
    stepLabel: {
      color: "#94A3B8",
      fontSize: 12,
      fontWeight: "500",
    },
    stepLabelActive: {
      color: "#233D8B",
      fontWeight: "800",
    },
    progressTrack: {
      height: 3,
      backgroundColor: "rgba(255,255,255,0.35)",
      borderRadius: 3,
      marginTop: 14,
      overflow: "hidden",
    },
    progressFill: {
      height: 3,
      backgroundColor: "#233D8B",
      borderRadius: 3,
    },
    form: {
      backgroundColor: "transperant",
      borderRadius: 0,
      paddingHorizontal: 4,
      paddingVertical: 12,
      marginTop: 12,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: "#233D8B",
      marginBottom: 10,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: "#64748B",
      marginTop: 12,
      marginBottom: 6,
    },
    readOnlyInput: {
      backgroundColor: "#F1F4F9",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#E2E8F0",
      padding: 13,
      color: "#334155",
      fontSize: 14,
    },
    loanCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: 15,
      marginTop: 18,
    },
    loanCardTitle: {
      color: "#233D8B",
      fontSize: 17,
      fontWeight: "700",
      marginBottom: 12,
    },
    loanRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(221, 212, 212, 0.93)",
    },
    loanLabel: {
      color: "#64748B",
      fontSize: 14,
    },
    loanValue: {
      color: "#233D8B",
      fontSize: 14,
      fontWeight: "700",
    },
    loanRowLast: {
      borderBottomWidth: 0,
    },
    monthlyPaymentLabel: {
      color: "#233D8B",
      fontWeight: "700",
    },
    monthlyPaymentValue: {
      fontSize: 17,
      fontWeight: "800",
    },
    formCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: 16,
      marginTop: 14,
    },
    label: {
      fontSize: 15,
      fontWeight: "600",
      color: "#64748B",
      marginTop: 14,
      marginBottom: 8,
    },
    input: {
      backgroundColor: "#F1F4F9",
      borderWidth: 1,
      borderColor: "#E2E8F0",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 15,
      color: "#334155",
    },
    employmentOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 1,
      marginTop: 5,
    },
    employmentOptionActive: {
      backgroundColor: "#EEF2FA",
      borderRadius: 10,
      paddingHorizontal: 10,
    },
    optionText: {
      color: "#334155",
      fontSize: 15,
    },
  });
