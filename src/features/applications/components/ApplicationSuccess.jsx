import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ApplicationSuccess({ applicationId, onHome }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark" size={48} color="#FFFFFF" />
      </View>

      <Text style={styles.title}>Заявката е изпратена!</Text>

      <Text style={styles.subtitle}>
        Благодарим ти! Получихме успешно твоята заявка за кредит. Тя ще бъде
        разгледана и ще можеш да следиш нейния статус.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Номер на заявката</Text>

        <Text selectable style={styles.applicationId}>
          {applicationId || "—"}
        </Text>

        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>В очакване на разглеждане</Text>
        </View>
      </View>

      <Pressable style={styles.button} onPress={onHome}>
        <Text style={styles.buttonText}>Към началната страница</Text>
        <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 45,
    paddingBottom: 30,
    gap: 18,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#16A36A",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#233D8B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
    textAlign: "center",
    paddingHorizontal: 12,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    gap: 12,
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    color: "#64748B",
  },
  applicationId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#233D8B",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E5A000",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  button: {
    width: "100%",
    backgroundColor: "#233D8B",
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
