import { StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/common/AppHeader";
import WelcomeCard from "../components/cards/WelcomeCard";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <WelcomeCard />
    </SafeAreaView>
  );
}

const createStyles = (width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F8FC",
      paddingHorizontal: width < 380 ? 16 : 24,
      paddingTop: 20,
    },
  });
