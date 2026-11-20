import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { useResponsive } from "../../../utils/responsive";

import { useAuth } from "../../auth/context/AuthContext";
import ApplicationReview from "../components/ApplicationReview";
import ApplicationFormStep from "../components/ApplicationFormStep";
import ApplicationSuccess from "../components/ApplicationSuccess";
import { checkLoan } from "../utils/automaticCheckLoan";
import { generateInstallments } from "../utils/generateInstallments";

export default function ApplyScreen() {
  const { width, isSmallPhone, horizontalPadding, moderateScale } =
    useResponsive();

  const styles = createStyles({
    width,
    isSmallPhone,
    horizontalPadding,
    moderateScale,
  });
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const [step, setStep] = useState(1);

  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [applicationId, setApplicationId] = useState(null);
  const [applicationResult, setApplicationResult] = useState(null);

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    email: user?.email || "",
  });

  const loan = {
    amount: Number(params.amount),
    months: Number(params.months),
    annualRate: Number(params.annualRate),
    monthlyPayment: Number(params.monthlyPayment),
  };

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
      </View>
    );
  };

  const handleNext = () => {
    const income = Number(monthlyIncome.replace(",", "."));

    if (!monthlyIncome.trim() || !Number.isFinite(income) || income <= 0) {
      alert("Моля, въведи валиден месечен доход.");
      return;
    }

    if (!employmentType) {
      alert("Моля, избери вид заетост.");
      return;
    }

    if (employmentType !== "Безработен" && !workplace.trim()) {
      alert("Моля, въведи месторабота.");
      return;
    }

    if (!loanPurpose) {
      alert("Моля, избери цел на кредита.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      alert("Трябва да влезеш в профила си.");
      return;
    }

    try {
      setIsSubmitting(true);

      const income = Number(monthlyIncome.replace(",", "."));

      const { data, error } = await supabase
        .from("loan_applications")
        .insert({
          user_id: user.id,
          requested_amount: loan.amount,
          annual_interest_rate: loan.annualRate,
          term_months: loan.months,
          monthly_income: Number(monthlyIncome.replace(",", ".")),
          monthly_payment: loan.monthlyPayment,
          loan_purpose: loanPurpose,
          workplace: workplace.trim(),
          employment_type: employmentType,
          status: "pending",
        })
        .select("id")
        .single();

      if (error) throw error;

      const result = checkLoan({
        income,
        payment: loan.monthlyPayment,
        oldPayments: 0,
        amount: loan.amount,
        months: loan.months,
        employmentType,
      });

      const { error: updateError } = await supabase
        .from("loan_applications")
        .update({
          status: result.status,
          assessment_score: result.score,
          assessment_reason: result.reason,
          rejection_reason: result.status === "rejected" ? result.reason : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      if (result.status === "approved") {
        const { data: newLoan, error: loanError } = await supabase
          .from("loans")
          .insert({
            user_id: user.id,
            name: loanPurpose || "Потребителски кредит",
            principal_amount: loan.amount,
            annual_interest_rate: loan.annualRate,
            term_months: loan.months,
            start_date: new Date().toISOString().split("T")[0],
            status: "active",
          })
          .select("id")
          .single();

        if (loanError) throw loanError;

        const installments = generateInstallments(
          loan.amount,
          loan.annualRate,
          loan.months,
        );

        const installmentsWithLoanId = installments.map((installment) => ({
          ...installment,
          loan_id: newLoan.id,
        }));

        const { error: installmentsError } = await supabase
          .from("installments")
          .insert(installmentsWithLoanId);

        if (installmentsError) {
          console.error(
            "[INSTALLMENTS] Creation failed:",
            installmentsError.message,
          );

          alert(
            "Кредитът е създаден, но възникна грешка при генерирането на погасителния план.",
          );

          return;
        }
      }

      setApplicationId(data.id);
      setApplicationResult(result);
      setStep(3);
    } catch (error) {
      console.error("[APPLICATION] Submission failed:", error.message);
      alert("Възникна грешка при изпращането. Опитай отново.");
    } finally {
      setIsSubmitting(false);
    }
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
  }, [user?.id, user?.email]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              if (step === 2) {
                setStep(1);
              } else {
                router.back();
              }
            }}
          >
            <Ionicons name="arrow-back" size={25} color="#233D8B" />
          </Pressable>
          <View style={styles.stepperContainer}>{renderSteps()}</View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Зареждане на профила...</Text>
          </View>
        ) : (
          <>
            {step === 1 && (
              <ApplicationFormStep
                profile={profile}
                loan={loan}
                monthlyIncome={monthlyIncome}
                setMonthlyIncome={setMonthlyIncome}
                workplace={workplace}
                setWorkplace={setWorkplace}
                employmentType={employmentType}
                setEmploymentType={setEmploymentType}
                loanPurpose={loanPurpose}
                setLoanPurpose={setLoanPurpose}
                onNext={handleNext}
              />
            )}

            {step === 2 && (
              <ApplicationReview
                profile={profile}
                monthlyIncome={monthlyIncome}
                workplace={workplace}
                employmentType={employmentType}
                loanPurpose={loanPurpose}
                loan={loan}
                onBack={() => setStep(1)}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 3 && (
              <ApplicationSuccess
                applicationId={applicationId}
                result={applicationResult}
                onHome={() => router.replace("/home")}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = ({
  isSmallPhone,
  width,
  horizontalPadding,
  moderateScale,
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#BAC8E0",
    },
    scrollContent: {
      paddingHorizontal: horizontalPadding,
      paddingTop: 4,
      paddingBottom: 30,
      width: "100%",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      gap: moderateScale(width < 360 ? 8 : 12),
      marginBottom: 15,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    loadingText: {
      color: "#233D8B",
      fontSize: moderateScale(15),
      fontWeight: "600",
    },
    stepperContainer: {
      flex: 1,
      minWidth: 0,
    },
    stepper: {
      width: "100%",
      paddingHorizontal: width < 360 ? 0 : 4,
      paddingVertical: 2,
    },
    stepsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      width: "100%",
    },
    stepItem: {
      flex: 1,
      minWidth: 0,
      alignItems: "center",
      gap: 4,
    },
    stepCircle: {
      width: moderateScale(isSmallPhone ? 26 : 30),
      height: moderateScale(isSmallPhone ? 26 : 30),
      borderRadius: moderateScale(isSmallPhone ? 13 : 15),
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
      fontSize: moderateScale(13),
    },
    stepNumberActive: {
      color: "#FFFFFF",
    },
    stepLabel: {
      color: "#94A3B8",
      fontSize: moderateScale(isSmallPhone ? 10 : width > 430 ? 13 : 12),
      fontWeight: "500",
      textAlign: "center",
    },
    stepLabelActive: {
      color: "#233D8B",
      fontWeight: "800",
    },
  });
