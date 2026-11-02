import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

export default function FinanceSummary() {
  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        <View style={styles.financeCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="business-outline" size={22} color="#233D8B" />
          </View>

          <Text style={styles.cardLabel}>Активни кредити</Text>
          <Text style={styles.cardValue}>0</Text>
        </View>

        <View style={styles.financeCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet-outline" size={22} color="#233D8B" />
          </View>

          <Text style={styles.cardLabel}>Общо задължение</Text>
          <Text style={styles.cardValue}>0,00 €</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#17366F",
    marginBottom: 16,
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
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#E8EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 21,
    fontWeight: "800",
    color: "#17366F",
  },
});
