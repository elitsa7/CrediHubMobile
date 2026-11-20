import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { useLoans } from "../../loans/hooks/useLoans";
import { useRouter } from "expo-router";

export default function FinanceSummary() {
  const { loans, isLoading, error } = useLoans();
  const router = useRouter();
  console.log(
    "[FINANCE SUMMARY]",
    loans.map((loan) => ({
      id: loan.id,
      name: loan.name,
      principal: loan.principal_amount,
      installmentsCount: loan.installments?.length ?? 0,
      remaining: (loan.installments ?? []).reduce(
        (sum, installment) =>
          sum +
          Math.max(
            0,
            Number(installment.total_amount || 0) -
              Number(installment.paid_amount || 0),
          ),
        0,
      ),
    })),
  );

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

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  financeCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    minHeight: 145,
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
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 8,
  },
  value: {
    fontSize: 23,
    fontWeight: "800",
    color: "#233D8B",
  },
  error: {
    fontSize: 22,
    fontWeight: "700",
    color: "#DC2626",
  },
});
