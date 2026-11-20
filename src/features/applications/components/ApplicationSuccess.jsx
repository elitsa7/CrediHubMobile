import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useResponsive } from "../../../utils/responsive";

export default function ApplicationSuccess({ applicationId, result, onHome }) {
  const { isSmallPhone, cardPadding, moderateScale, sectionGap } =
    useResponsive();

  const styles = createStyles({
    isSmallPhone,
    cardPadding,
    moderateScale,
    sectionGap,
  });
  const isApproved = result?.status === "approved";
  const isRejected = result?.status === "rejected";
  const statusConfig = isApproved
    ? {
        title: "Кредитът е одобрен!",
        subtitle: "Поздравления! Заявката ти отговаря на условията.",
        status: "Одобрена заявка",
        icon: "checkmark-circle",
        color: "#16A36A",
      }
    : isRejected
      ? {
          title: "Заявката е отхвърлена",
          subtitle: "За съжаление заявката не отговаря на условията.",
          status: "Отхвърлена заявка",
          icon: "close-circle",
          color: "#DC2626",
        }
      : {
          title: "Заявката е изпратена!",
          subtitle: "Получихме успешно твоята заявка.",
          status: "В очакване на разглеждане",
          icon: "time",
          color: "#E5A000",
        };

  return (
    <View style={styles.container}>
      <View
        style={[styles.iconContainer, { backgroundColor: statusConfig.color }]}
      >
        <Ionicons name={statusConfig.icon} size={48} color="#FFFFFF" />
      </View>

      <Text style={styles.title}>{statusConfig.title}</Text>

      <Text style={styles.subtitle}>{statusConfig.subtitle}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Номер на заявката</Text>

        <Text selectable style={styles.applicationId}>
          {applicationId || "—"}
        </Text>

        <View style={styles.statusRow}>
          <View
            style={[styles.statusDot, { backgroundColor: statusConfig.color }]}
          />
          <Text style={styles.statusText}>{statusConfig.status}</Text>
        </View>

        {isRejected && result?.reason && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonTitle}>Причина за отказа</Text>
            <Text style={styles.reasonText}>{result.reason}</Text>
          </View>
        )}

        {isApproved && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonTitle}>Оценка на заявката</Text>
            <Text style={styles.reasonText}>{result.score}/100 точки</Text>
          </View>
        )}
      </View>

      <Pressable style={styles.button} onPress={onHome}>
        <Text style={styles.buttonText}>Към началната страница</Text>
        <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
      </Pressable>
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
      flex: 1,
      alignItems: "center",
      paddingTop: moderateScale(45),
      paddingBottom: 30,
      paddingHorizontal: cardPadding,
      gap: sectionGap,
    },
    iconContainer: {
      width: moderateScale(90),
      height: moderateScale(90),
      borderRadius: moderateScale(45),
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: moderateScale(isSmallPhone ? 21 : 24),
      fontWeight: "800",
      color: "#233D8B",
      textAlign: "center",
    },
    subtitle: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(22),
      color: "#475569",
      textAlign: "center",
      paddingHorizontal: 12,
    },
    card: {
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: cardPadding,
      gap: 12,
      marginTop: 10,
    },
    label: {
      fontSize: moderateScale(13),
      color: "#64748B",
    },
    applicationId: {
      fontSize: moderateScale(14),
      fontWeight: "700",
      color: "#233D8B",
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 5,
      flexWrap: "wrap",
    },
    statusDot: {
      width: 9,
      height: 9,
      borderRadius: 5,
    },
    statusText: {
      fontSize: moderateScale(13),
      fontWeight: "600",
      color: "#64748B",
      flexShrink: 1,
    },
    reasonContainer: {
      borderTopWidth: 1,
      borderTopColor: "#E2E8F0",
      paddingTop: 12,
      gap: 5,
    },
    reasonTitle: {
      fontSize: moderateScale(13),
      fontWeight: "700",
      color: "#233D8B",
    },
    reasonText: {
      fontSize: moderateScale(13),
      lineHeight: moderateScale(20),
      color: "#475569",
    },
    button: {
      width: "100%",
      backgroundColor: "#233D8B",
      paddingVertical: moderateScale(16),
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 8,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: moderateScale(15),
      fontWeight: "700",
    },
  });
