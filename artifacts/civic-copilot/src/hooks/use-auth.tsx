import { createContext, useContext, ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCurrentUser, useLoginUser, useLogoutUser, useRegisterUser } from "@workspace/api-client-react";
import { User, LoginRequest, RegisterRequest } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  login: ReturnType<typeof useLoginUser>["mutateAsync"];
  logout: ReturnType<typeof useLogoutUser>["mutateAsync"];
  register: ReturnType<typeof useRegisterUser>["mutateAsync"];
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // We explicitly handle errors by returning null so the query doesn't throw and break rendering
  const { data: user, isLoading } = useGetCurrentUser({
    query: {
      retry: false,
      staleTime: Infinity,
    }
  });

  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useLoginUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      },
    },
  });

  const { mutateAsync: registerMutation, isPending: isRegistering } = useRegisterUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      },
    },
  });

  const { mutateAsync: logoutMutation, isPending: isLoggingOut } = useLogoutUser({
    mutation: {
      onSuccess: () => {
        queryClient.setQueryData(["/api/auth/me"], null);
        queryClient.invalidateQueries(); // Clear all protected data
      },
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: loginMutation,
        logout: logoutMutation,
        register: registerMutation,
        isLoggingIn,
        isRegistering,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
