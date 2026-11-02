import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View>
          <Text style={styles.logo}>CrediHub</Text>
          <Text style={styles.subtitle}>Твоите финанси. Под твой контрол.</Text>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={23} color="#233D8B" />
            <View style={styles.notificationDot} />
          </View>

          <View style={styles.profileButton}>
            <Ionicons name="person-outline" size={22} color="#233D8B" />
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#233D8B",
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },
  brand: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8EEFF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8EEFF",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1,
    borderColor: "#E8EEFF",
  },
});
