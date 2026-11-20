import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useResponsive } from "../../../utils/responsive";
import { useLoanDetails } from "../hooks/useLoanDetails";

export default function LoanDetailsScreen({ loanId }) {
  const { loan, isLoading, error } = useLoanDetails(loanId);

  const {
    horizontalPadding,
    contentMaxWidth,
    cardPadding,
    moderateScale,
    sectionGap,
  } = useResponsive();

  const styles = createStyles({
    horizontalPadding,
    contentMaxWidth,
    cardPadding,
    moderateScale,
    sectionGap,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#233D8B" />
          <Text>Зареждане на кредита...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !loan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={42} color="#DC2626" />
          <Text>{error || "Кредитът не е намерен."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Детайли за кредита</Text>
          <Text style={styles.subtitle}>
            {loan.name || "Потребителски кредит"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Размер на кредита</Text>

          <Text style={styles.amount}>
            {Number(loan.principal_amount).toLocaleString("bg-BG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            €
          </Text>

          <Text style={styles.label}>
            Годишна лихва: {loan.annual_interest_rate}%
          </Text>

          <Text style={styles.label}>Срок: {loan.term_months} месеца</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = ({
  horizontalPadding,
  contentMaxWidth,
  cardPadding,
  moderateScale,
  sectionGap,
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#bac8e0",
    },
    scrollContent: {
      flexGrow: 1,
      width: "100%",
      maxWidth: contentMaxWidth,
      alignSelf: "center",
      paddingHorizontal: horizontalPadding,
      paddingTop: moderateScale(20),
      paddingBottom: 30,
    },
    header: {
      marginBottom: sectionGap,
    },
    title: {
      fontSize: moderateScale(27),
      fontWeight: "800",
      color: "#233D8B",
    },
    subtitle: {
      fontSize: moderateScale(16),
      color: "#64748B",
      marginTop: 8,
    },
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: cardPadding,
      gap: sectionGap,
      width: "100%",
    },
    label: {
      fontSize: moderateScale(14),
      color: "#64748B",
    },
    amount: {
      fontSize: moderateScale(28),
      fontWeight: "800",
      color: "#172554",
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: horizontalPadding,
      backgroundColor: "#bac8e0",
    },
  });
