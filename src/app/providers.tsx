'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IUser, UserContextProvider } from '@/contexts/userContext';
import { IUserVotes, ProjectsContextProvider } from '@/contexts/projectsContext';
import { ICategory } from './api/categories/route';
import { IProject } from './api/projects/route';

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
  initialUser?: IUser | null; // Allow passing initialUser for SSR
  categories?: ICategory[];
  initialProjects?: { projects: IProject[] };
  userVotes?: IUserVotes;
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
  categories,
  initialProjects,
  userVotes,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider initialUser={initialUser}>
        <ProjectsContextProvider
          categories={categories || []}
          initialProjects={initialProjects || { projects: [] }}
          userVotes={userVotes || null}
        >
          {children}
        </ProjectsContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
};
