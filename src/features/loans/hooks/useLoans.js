import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../auth/context/AuthContext";

export function useLoans() {
  const { user } = useAuth();

  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const fetchLoans = useCallback(
    async (isRefresh = false) => {
      if (!user) {
        setLoans([]);
        setIsLoading(false);
        setRefreshing(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const { data, error } = await supabase
          .from("loans")
          .select(
            `
        *,
        installments (
          total_amount,
          paid_amount,
          status
        )
      `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setLoans(data ?? []);
      } catch (error) {
        console.error("[LOANS] Fetch failed:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLoans();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchLoans]);
  const refreshLoans = useCallback(() => {
    fetchLoans(true);
  }, [fetchLoans]);
  return {
    loans,
    isLoading,
    error,
    refreshing,
    refreshLoans,
  };
}
