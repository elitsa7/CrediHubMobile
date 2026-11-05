import { StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import AppHeader from "../../components/common/AppHeader";
import WelcomeCard from "../../features/dashboard/components/WelcomeCard";
import FinancialCard from "../../features/dashboard/components/FinanceSummary";
import NextPaymentCard from "../../features/dashboard/components/NextPaymentCard";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const styles = createStyles(width);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader />
        <WelcomeCard />
        <FinancialCard />
        <NextPaymentCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#bac8e0",
      paddingHorizontal: width < 380 ? 16 : 24,
      paddingTop: 20,
    },
  });
