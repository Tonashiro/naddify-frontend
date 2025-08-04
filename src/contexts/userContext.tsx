'use client';

import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface IUser {
  id: string;
  discord_id: string;
  username: string;
  wallet_address: string | null;
  avatar: string | null;
  is_admin: boolean;
  can_vote: boolean;
  created_at: string;
  twitter_username: string | null;
  twitter_id: string | null;
}

interface IUserContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  isLoading: boolean;
  refetch: () => void;
  connectDiscord: () => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserContextProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: IUser | null; // Accept initial user data
}) => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(initialUser || null); // Use initialUser if provided
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      Cookies.set('token', token, {
        path: '/',
        expires: 7,
        sameSite: 'Lax',
        secure: true,
      });
      router.replace('/');
    }
  }, [searchParams, router]);

  // Function to redirect to Discord authorization
  const connectDiscord = useCallback(() => {
    router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/discord`);
  }, [router]);

  const { isLoading, refetch } = useQuery<IUser | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/user', {
        credentials: 'include',
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);

        return userData;
      } else {
        throw new Error('Failed to fetch user');
      }
    },
    enabled: !initialUser, // Only fetch if initialUser is not provided
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const contextValue = useMemo(
    () => ({ user, isLoading, refetch, connectDiscord, setUser }),
    [user, isLoading, refetch, connectDiscord],
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = (): IUserContext => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  return context;
};
