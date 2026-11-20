import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../auth/context/AuthContext";

export function useLoanDetails(id) {
  const { user } = useAuth();

  const [loan, setLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLoanDetails = async () => {
      if (!id || !user?.id) {
        setError("Липсва информация за кредита.");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("loans")
        .select(
          `
          *,
          installments (*)
        `,
        )
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!isMounted) return;

      if (error) {
        console.error("[LOAN DETAILS]", error.message);
        setError(error.message);
      } else {
        setLoan(data);
      }

      setIsLoading(false);
    };

    fetchLoanDetails();

    return () => {
      isMounted = false;
    };
  }, [id, user?.id]);

  return { loan, isLoading, error };
}
