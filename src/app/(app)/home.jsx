import {
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Pressable,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import AppHeader from "../../components/common/AppHeader";
import WelcomeCard from "../../features/home/components/WelcomeCard";
import FinancialCard from "../../features/home/components/FinanceSummary";
import NextPaymentCard from "../../features/home/components/NextPaymentCard";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const router = useRouter();
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
