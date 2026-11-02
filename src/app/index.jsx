import { View, StyleSheet } from "react-native";
import AppHeader from "../components/common/AppHeader";
import WelcomeCard from "../components/cards/WelcomeCard";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <AppHeader />
      <WelcomeCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FC",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
});
