"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCurrentUser, useUpdateUser } from "./api/useUsers";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/types/api";

interface BalanceContextType {
  balance: number;
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  isLoading: boolean;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Use React Query hook instead of manual fetch
  const { data: user, isLoading } = useCurrentUser();
  const updateUserMutation = useUpdateUser();

  const balance = user ? Math.abs(user.balance || 0) : 0;

  const addBalance = (amount: number) => {
    if (!user) return;

    const newBalance = balance + amount;

    // Optimistic update
    queryClient.setQueryData(QueryKeys.user(user.user_email), {
      ...user,
      balance: newBalance,
    });

    // Update in backend
    updateUserMutation.mutate({
              ID: user.ID,
              user_email: user.user_email,
      balance: newBalance.toString(),
    });
  };

  const deductBalance = (amount: number): boolean => {
    if (!user) return false;
    if (Math.abs(balance) < amount) return false;

    const newBalance = Math.abs(balance) - amount;

    // Optimistic update
    queryClient.setQueryData(QueryKeys.user(user.user_email), {
      ...user,
      balance: newBalance,
    });

    // Update in backend
    updateUserMutation.mutate({
                ID: user.ID,
                user_email: user.user_email,
      balance: newBalance.toString(),
    });

    return true;
  };

  return (
    <BalanceContext.Provider
      value={{ balance, addBalance, deductBalance, isLoading }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
}
