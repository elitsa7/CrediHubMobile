import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../../../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("[AUTH] Session check failed:", error.message);
      }

      setSession(data?.session ?? null);
      setIsLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.info("[AUTH] Session state changed");

      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
