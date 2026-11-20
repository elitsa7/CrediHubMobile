import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { useResponsive } from "../../../utils/responsive";

export default function NextPaymentCard() {
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
      <View style={styles.header}>
        <Text style={styles.label}>СЛЕДВАЩА ВНОСКА</Text>
        <Text style={styles.subtitle}>Предстоящо плащане</Text>
      </View>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>ПРЕДСТОЯЩО</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Размер на вноската</Text>
        <Text style={styles.amount}>450 €</Text>
      </View>

      <View style={styles.paymentInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#64748b" />
          <Text style={styles.infoText}>Дата на плащане: 15.11.2026</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Погасена част</Text>
          <Text style={styles.progressPercentage}>65%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>
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
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: cardPadding,
      marginTop: sectionGap,
    },
    header: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 5,
      marginBottom: 18,
    },
    label: {
      fontSize: moderateScale(isSmallPhone ? 12 : 13),
      fontWeight: "700",
      color: "#64748b",
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: moderateScale(isSmallPhone ? 13 : 14),
      color: "#10285C",
      marginTop: 4,
      fontWeight: "600",
    },
    statusBadge: {
      alignSelf: "flex-start",
      backgroundColor: "#FEF3C7",
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      marginBottom: 16,
    },
    statusText: {
      fontSize: moderateScale(11),
      fontWeight: "600",
      color: "#92400E",
    },
    amountContainer: {
      marginBottom: 18,
    },
    amountLabel: {
      fontSize: moderateScale(13),
      color: "#64748b",
      marginBottom: 6,
    },
    amount: {
      fontSize: moderateScale(isSmallPhone ? 28 : 34),
      fontWeight: "700",
      color: "#10285C",
    },
    paymentInfo: {
      gap: 12,
      marginBottom: 20,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    infoText: {
      fontSize: moderateScale(isSmallPhone ? 12 : 14),
      color: "#475569",
      flexShrink: 1,
    },
    progressContainer: {
      marginTop: 4,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    progressLabel: {
      fontSize: moderateScale(13),
      fontWeight: "600",
      color: "#475569",
    },
    progressPercentage: {
      fontSize: moderateScale(13),
      fontWeight: "700",
      color: "#10285C",
    },
    progressBar: {
      height: 8,
      backgroundColor: "#E2E8F0",
      borderRadius: 10,
      overflow: "hidden",
    },
    progressFill: {
      width: "65%",
      height: "100%",
      backgroundColor: "#3159A5",
      borderRadius: 10,
    },
  });
