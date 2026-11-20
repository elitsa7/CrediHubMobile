import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useResponsive } from "../../../utils/responsive";

export default function ApplicationReview({
  profile,
  monthlyIncome,
  workplace,
  employmentType,
  loanPurpose,
  loan,
  onBack,
  onSubmit,
  isSubmitting,
}) {
  const { isSmallPhone, cardPadding, moderateScale, sectionGap } =
    useResponsive();

  const styles = createStyles({
    isSmallPhone,
    cardPadding,
    moderateScale,
    sectionGap,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Преглед на заявката</Text>

      <Text style={styles.subtitle}>
        Провери въведената информация преди изпращане.
      </Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-outline" size={22} color="#233D8B" />
          <Text style={styles.sectionTitle}>Лични данни</Text>
        </View>

        <ReviewRow styles={styles} label="Три имена" value={profile.fullName} />
        <ReviewRow styles={styles} label="Телефон" value={profile.phone} />
        <ReviewRow styles={styles} label="Имейл" value={profile.email} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="briefcase-outline" size={22} color="#233D8B" />
          <Text style={styles.sectionTitle}>Финансова информация</Text>
        </View>

        <ReviewRow
          styles={styles}
          label="Месечен доход"
          value={monthlyIncome ? `${monthlyIncome} €` : ""}
        />
        <ReviewRow styles={styles} label="Месторабота" value={workplace} />
        <ReviewRow styles={styles} label="Вид заетост" value={employmentType} />
        <ReviewRow styles={styles} label="Цел на кредита" value={loanPurpose} />
      </View>

      <View style={styles.loanCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="wallet-outline" size={22} color="#FFFFFF" />
          <Text style={styles.loanTitle}>Параметри на кредита</Text>
        </View>

        <Text style={styles.loanLabel}>Месечна вноска</Text>

        <Text style={styles.loanPayment}>
          {loan.monthlyPayment.toFixed(2)} €
        </Text>

        <View style={styles.divider} />

        <LoanRow
          styles={styles}
          label="Желана сума"
          value={`${loan.amount.toFixed(2)} €`}
        />

        <LoanRow styles={styles} label="Срок" value={`${loan.months} месеца`} />

        <LoanRow
          styles={styles}
          label="Годишна лихва"
          value={`${loan.annualRate.toFixed(2)} %`}
        />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
          onPress={onSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Изпращане..." : "Изпрати заявката"}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>

        <Pressable style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={18} color="#233D8B" />
          <Text style={styles.backButtonText}>Назад към данните</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ReviewRow({ styles, label, value }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value || "—"}</Text>
    </View>
  );
}

function LoanRow({ styles, label, value }) {
  return (
    <View style={styles.loanRow}>
      <Text style={styles.loanText}>{label}</Text>
      <Text style={styles.loanValue}>{value}</Text>
    </View>
  );
}

const createStyles = ({
  isSmallPhone,
  cardPadding,
  moderateScale,
  sectionGap,
}) =>
  StyleSheet.create({
    container: {
      gap: sectionGap - 6,
      paddingBottom: 20,
    },
    title: {
      fontSize: moderateScale(isSmallPhone ? 20 : 22),
      fontWeight: "800",
      color: "#233D8B",
    },
    subtitle: {
      fontSize: moderateScale(13),
      color: "#64748B",
      marginTop: -8,
      marginBottom: 4,
    },
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: cardPadding,
      gap: 12,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: moderateScale(17),
      fontWeight: "700",
      color: "#233D8B",
    },
    reviewRow: {
      gap: 4,
      paddingBottom: 9,
      borderBottomWidth: 1,
      borderBottomColor: "#EEF1F6",
    },
    reviewLabel: {
      fontSize: moderateScale(13),
      color: "#64748B",
    },
    reviewValue: {
      fontSize: moderateScale(15),
      fontWeight: "600",
      color: "#334155",
      flexShrink: 1,
    },
    loanCard: {
      backgroundColor: "#233D8B",
      borderRadius: 18,
      padding: cardPadding,
      gap: 10,
    },
    loanTitle: {
      fontSize: moderateScale(17),
      fontWeight: "700",
      color: "#FFFFFF",
    },
    loanLabel: {
      fontSize: moderateScale(13),
      color: "#DCE5F5",
    },
    loanPayment: {
      fontSize: moderateScale(isSmallPhone ? 26 : 30),
      fontWeight: "800",
      color: "#FFFFFF",
    },
    divider: {
      height: 1,
      backgroundColor: "#6478AD",
      marginVertical: 6,
    },
    loanRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
    },
    loanText: {
      fontSize: moderateScale(13),
      color: "#DCE5F5",
      flexShrink: 1,
    },
    loanValue: {
      fontSize: moderateScale(14),
      fontWeight: "700",
      color: "#FFFFFF",
      flexShrink: 1,
    },
    actions: {
      gap: 12,
      marginTop: 20,
    },
    submitButton: {
      backgroundColor: "#233D8B",
      paddingVertical: moderateScale(16),
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    submitButtonText: {
      color: "#FFFFFF",
      fontSize: moderateScale(15),
      fontWeight: "700",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: moderateScale(14),
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: "#233D8B",
      backgroundColor: "transparent",
    },
    backButtonText: {
      color: "#233D8B",
      fontSize: moderateScale(14),
      fontWeight: "600",
    },
  });
