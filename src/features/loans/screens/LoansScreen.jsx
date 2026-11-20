import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLoans } from "../hooks/useLoans";

export default function LoansScreen() {
  const { loans, isLoading, error, refreshing, refreshLoans } = useLoans();

  const renderLoan = ({ item }) => (
    <View style={styles.loanCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="wallet-outline" size={24} color="#233D8B" />
        </View>

        <Text style={styles.loanName}>
          {item.name || "Потребителски кредит"}
        </Text>
      </View>

      <Text style={styles.label}>Размер на кредита</Text>

      <Text style={styles.amount}>
        {Number(item.principal_amount).toLocaleString("bg-BG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        €
      </Text>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View>
          <Text style={styles.label}>Годишна лихва</Text>
          <Text style={styles.detailValue}>{item.annual_interest_rate}%</Text>
        </View>

        <View>
          <Text style={styles.label}>Срок</Text>
          <Text style={styles.detailValue}>{item.term_months} месеца</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Моите кредити</Text>
        <Text style={styles.subtitle}>Управлявай своите активни кредити</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#233D8B" />
          <Text style={styles.message}>Зареждане на кредитите...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={42} color="#DC2626" />
          <Text style={styles.error}>Не успяхме да заредим кредитите.</Text>
          <Text style={styles.message}>{error}</Text>
        </View>
      ) : loans.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="wallet-outline" size={55} color="#64748B" />
          <Text style={styles.emptyTitle}>Все още нямаш кредити</Text>
          <Text style={styles.message}>
            Тук ще се показват одобрените ти кредити.
          </Text>
        </View>
      ) : (
        <FlatList
          data={loans}
          renderItem={renderLoan}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshLoans}
              colors={["#233D8B"]}
              tintColor="#233D8B"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bac8e0",
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#233D8B",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
  },
  loanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E8EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  loanName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#233D8B",
  },
  label: {
    fontSize: 13,
    color: "#64748B",
  },
  amount: {
    fontSize: 27,
    fontWeight: "800",
    color: "#172554",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 18,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#233D8B",
    marginTop: 6,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#233D8B",
    marginTop: 16,
  },
  message: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
  },
  error: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
    marginTop: 12,
  },
  list: {
    paddingBottom: 24,
  },
});
