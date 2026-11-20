import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useResponsive } from "../../../utils/responsive";
import { useLoans } from "../../loans/hooks/useLoans";

export default function FinanceSummary() {
  const { loans, isLoading, error } = useLoans();
  const router = useRouter();
  const { isSmallPhone, isTablet, cardPadding, moderateScale, sectionGap } =
    useResponsive();

  const styles = createStyles({
    isSmallPhone,
    isTablet,
    cardPadding,
    moderateScale,
    sectionGap,
  });

  const activeLoans = loans.filter((loan) => loan.status === "active").length;

  const totalDebt = loans.reduce((sum, loan) => {
    const installments = loan.installments ?? [];

    const remaining = installments.reduce((loanSum, installment) => {
      const total = Number(installment.total_amount) || 0;
      const paid = Number(installment.paid_amount) || 0;

      return loanSum + Math.max(0, total - paid);
    }, 0);
    return sum + remaining;
  }, 0);

  const formattedDebt = totalDebt.toLocaleString("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        <Pressable
          style={styles.financeCard}
          onPress={() => router.push("/loans")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="business-outline" size={22} color="#233D8B" />
          </View>

          <Text style={styles.cardLabel}>Активни кредити</Text>
          {isLoading ? (
            <ActivityIndicator color="#233D8B" />
          ) : error ? (
            <Text style={styles.error}>—</Text>
          ) : (
            <Text style={styles.value}>{activeLoans}</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.financeCard}
          onPress={() => router.push("/loans")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="wallet-outline" size={22} color="#233D8B" />
          </View>

          <Text style={styles.cardLabel}>Общо задължение</Text>
          {isLoading ? (
            <ActivityIndicator color="#233D8B" />
          ) : error ? (
            <Text style={styles.error}>—</Text>
          ) : (
            <Text style={styles.value}>{formattedDebt} €</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = ({
  isSmallPhone,
  isTablet,
  cardPadding,
  moderateScale,
  sectionGap,
}) =>
  StyleSheet.create({
    container: {
      marginTop: moderateScale(28),
    },
    cardsContainer: {
      flexDirection: isSmallPhone ? "column" : "row",
      flexWrap: "wrap",
      gap: sectionGap,
    },
    financeCard: {
      flex: isSmallPhone ? undefined : 1,
      width: isSmallPhone ? "100%" : undefined,
      minWidth: isTablet ? 220 : 0,
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: cardPadding,
      minHeight: isSmallPhone ? 130 : 145,
      justifyContent: "space-between",
      shadowColor: "#233D8B",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    iconContainer: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: "#E8EEFF",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    cardLabel: {
      fontSize: moderateScale(12),
      fontWeight: "500",
      color: "#64748B",
      marginBottom: 8,
    },
    value: {
      fontSize: moderateScale(23),
      fontWeight: "800",
      color: "#233D8B",
      flexShrink: 1,
    },
    error: {
      fontSize: moderateScale(22),
      fontWeight: "700",
      color: "#DC2626",
    },
  });
