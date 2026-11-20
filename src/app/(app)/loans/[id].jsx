import { useLocalSearchParams } from "expo-router";
import LoanDetailsScreen from "../../../features/loans/screens/LoanDetailsScreen";

export default function LoanDetailsPage() {
  const { id } = useLocalSearchParams();

  return <LoanDetailsScreen loanId={id} />;
}
