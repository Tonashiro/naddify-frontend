"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IUser, UserContextProvider } from "@/contexts/userContext";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
  initialUser?: IUser | null; // Allow passing initialUser for SSR
}

/**
 * The `Providers` component wraps the application with all necessary context providers.
 *
 *
 * @param children - The child components to be wrapped by the providers.
 *
 * @example
 * ```tsx
 * <Providers>
 *   <App />
 * </Providers>
 * ```
 */
export const Providers: React.FC<ProvidersProps> = ({
  children,
  initialUser,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider initialUser={initialUser}>
        {children}
      </UserContextProvider>
    </QueryClientProvider>
  );
};
