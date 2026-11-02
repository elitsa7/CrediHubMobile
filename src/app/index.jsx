import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CrediHub</Text>
      <Text style={styles.subtitle}>Твоите финанси. Под твой контрол.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FC",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1769AA",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 12,
    textAlign: "center",
  },
});
