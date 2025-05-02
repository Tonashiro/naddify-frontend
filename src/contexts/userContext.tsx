"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

export interface IUser {
  id: string;
  discord_id: string;
  username: string;
  avatar: string | null;
  is_admin: boolean;
  has_monad_role: boolean;
  created_at: string;
}

interface IUserContext {
  user: IUser | null;
  isLoading: boolean;
  refetch: () => void;
  connectDiscord: () => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // Function to redirect to Discord authorization
  const connectDiscord = useCallback(() => {
    router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/discord`);
  }, [router]);

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<IUser | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/discord", {
        credentials: "include",
      });

      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Failed to fetch user");
      }
    },
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const contextValue = useMemo(
    () => ({ user: user ?? null, isLoading, refetch, connectDiscord }),
    [user, isLoading, refetch, connectDiscord]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = (): IUserContext => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }

  return context;
};
