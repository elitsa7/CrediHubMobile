import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResponsive } from "../../../utils/responsive";
import AppHeader from "../../../components/common/AppHeader";
import WelcomeCard from "../../../features/home/components/WelcomeCard";
import FinancialCard from "../../../features/home/components/FinanceSummary";
import NextPaymentCard from "../../../features/home/components/NextPaymentCard";

export default function HomeScreen() {
  const { horizontalPadding, contentMaxWidth, moderateScale } = useResponsive();

  const styles = createStyles({
    horizontalPadding,
    contentMaxWidth,
    moderateScale,
  });
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

const createStyles = ({ horizontalPadding, contentMaxWidth, moderateScale }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#bac8e0",
      paddingHorizontal: horizontalPadding,
      paddingTop: moderateScale(20),
      width: "100%",
      maxWidth: contentMaxWidth,
      alignSelf: "center",
    },
  });
