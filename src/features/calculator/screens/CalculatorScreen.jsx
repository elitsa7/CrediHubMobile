import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { calculateLoan } from "../utils/calculateLoan";
import { LOAN_CONFIG } from "../../../config/loanConfig";

export default function CalculatorScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const [amount, setAmount] = useState(300);
  const [months, setMonths] = useState(3);
  const result = calculateLoan(amount, LOAN_CONFIG.annualInterestRate, months);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#233D8B" />
            </Pressable>
            <Text style={styles.title}>Кредитен калкулатор</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>ТВОЯТА МЕСЕЧНА ВНОСКА</Text>

            <Text style={styles.monthlyPayment}>
              {result.monthlyPayment.toFixed(2)} €
            </Text>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatLabel}>Обща лихва</Text>
                <Text style={styles.summaryStatValue}>
                  {result.totalInterest.toFixed(2)} €
                </Text>
              </View>

              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatLabel}>Общо плащане</Text>
                <Text style={styles.summaryStatValue}>
                  {result.totalPayment.toFixed(2)} €
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.controlsCard}>
            <View style={styles.sliderSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Сума на кредита</Text>
                <Text style={styles.value}>
                  {amount.toLocaleString("bg-BG")} €
                </Text>
              </View>

              <Slider
                style={styles.slider}
                minimumValue={LOAN_CONFIG.minAmount}
                maximumValue={LOAN_CONFIG.maxAmount}
                step={LOAN_CONFIG.amountStep}
                value={amount}
                onValueChange={setAmount}
                minimumTrackTintColor="#233D8B"
                maximumTrackTintColor="#D5DEEC"
                thumbTintColor="#233D8B"
              />

              <View style={styles.rangeLabels}>
                <Text style={styles.rangeText}>300 €</Text>
                <Text style={styles.rangeText}>30 000 €</Text>
              </View>
            </View>

            <View style={styles.controlDivider} />

            <View style={styles.sliderSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Срок на кредита</Text>
                <Text style={styles.value}>{months} месеца</Text>
              </View>

              <Slider
                style={styles.slider}
                minimumValue={LOAN_CONFIG.minMonths}
                maximumValue={LOAN_CONFIG.maxMonths}
                step={1}
                value={months}
                onValueChange={setMonths}
                minimumTrackTintColor="#233D8B"
                maximumTrackTintColor="#D5DEEC"
                thumbTintColor="#233D8B"
              />

              <View style={styles.rangeLabels}>
                <Text style={styles.rangeText}>3 месеца</Text>
                <Text style={styles.rangeText}>120 месеца</Text>
              </View>
            </View>

            <View style={styles.interestInfo}>
              <Text style={styles.interestLabel}>Фиксирана годишна лихва</Text>
              <Text style={styles.interestValue}>
                {LOAN_CONFIG.annualInterestRate}%
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.applyButton}
            onPress={() =>
              router.push({
                pathname: "/apply",
                params: {
                  amount: String(amount),
                  months: String(months),
                  annualRate: String(LOAN_CONFIG.annualInterestRate),
                  monthlyPayment: result.monthlyPayment.toFixed(2),
                },
              })
            }
          >
            <Text style={styles.applyButtonText}>Кандидатствай за кредит</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Ionicons name="shield-checkmark-outline" size={16} color="#233D8B" />
        <Text style={styles.footerText}>Сигурност и прозрачност</Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#BAC8E0",
    },
    scroll: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: width < 380 ? 16 : 22,
      paddingTop: 16,
      paddingBottom: 12,
    },
    mainContent: {
      flexGrow: 1,
      justifyContent: "space-between",
      gap: 14,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: width < 380 ? 19 : 22,
      fontWeight: "700",
      color: "#233D8B",
      flex: 1,
      letterSpacing: -0.5,
    },
    summaryCard: {
      backgroundColor: "#233D8B",
      paddingHorizontal: width < 380 ? 17 : 21,
      paddingVertical: width < 380 ? 16 : 19,
      borderRadius: 20,
      marginBottom: 14,
    },
    summaryLabel: {
      color: "#DCE5F5",
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    monthlyPayment: {
      color: "#FFFFFF",
      fontSize: width < 380 ? 31 : 36,
      fontWeight: "800",
      marginTop: 6,
      marginBottom: 11,
    },
    summaryDivider: {
      height: 1,
      backgroundColor: "#6478AD",
      marginBottom: 12,
    },
    summaryStats: {
      flexDirection: "row",
      gap: 12,
    },
    summaryStat: {
      flex: 1,
      gap: 4,
    },
    summaryStatLabel: {
      color: "#DCE5F5",
      fontSize: 12,
    },
    summaryStatValue: {
      color: "#FFFFFF",
      fontSize: width < 380 ? 14 : 16,
      fontWeight: "700",
    },
    controlsCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: width < 380 ? 16 : 20,
      gap: 16,
      marginBottom: 8,
    },
    sliderSection: {
      gap: 8,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
    },
    label: {
      color: "#233D8B",
      fontSize: 14,
      fontWeight: "700",
    },
    value: {
      color: "#233D8B",
      fontSize: 17,
      fontWeight: "800",
    },
    slider: {
      width: "100%",
      height: 32,
    },
    rangeLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rangeText: {
      color: "#718096",
      fontSize: 11,
    },
    controlDivider: {
      height: 1,
      backgroundColor: "#E5EAF2",
    },
    interestInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 4,
    },
    interestLabel: {
      color: "#64748B",
      fontSize: 13,
    },
    interestValue: {
      color: "#233D8B",
      fontSize: 15,
      fontWeight: "800",
    },
    applyButton: {
      backgroundColor: "#233D8B",
      borderRadius: 14,
      padding: 17,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginTop: 4,
      marginBottom: 0,
    },
    applyButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: "#A7B8D3",
    },
    footerText: {
      color: "#536887",
      fontSize: 12,
      fontWeight: "600",
    },
  });
