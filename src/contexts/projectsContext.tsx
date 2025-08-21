'use client';

import { ICategory } from '@/app/api/categories/route';
import { IProject } from '@/app/api/projects/route';
import { TVoteType } from '@/app/api/votes/[projectId]/route';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type TProjectVote = {
  id: string;
  projectId: string;
  projectName: string;
  voteType: TVoteType;
  createdAt: Date;
};

export interface IUserVotes {
  totalVotes: number;
  votes: Array<TProjectVote>;
}

interface IProjectsContext {
  categories: ICategory[];
  initialProjects: { projects: IProject[] };
  userVotes: IUserVotes | null;
  allProjects: IProject[];
  isLoadingAllProjects: boolean;
  errorAllProjects: string | null;
  refetchAllProjects: () => Promise<void>;
}

const ProjectsContext = createContext<IProjectsContext | undefined>(undefined);

export const ProjectsContextProvider = ({
  children,
  categories,
  initialProjects,
  userVotes,
}: {
  children: ReactNode;
  categories: ICategory[];
  initialProjects: { projects: IProject[] };
  userVotes: IUserVotes | null;
}) => {
  const [allProjects, setAllProjects] = useState<IProject[]>(initialProjects.projects);
  const [isLoadingAllProjects, setIsLoadingAllProjects] = useState(false);
  const [errorAllProjects, setErrorAllProjects] = useState<string | null>(null);

  const refetchAllProjects = async () => {
    try {
      setIsLoadingAllProjects(true);
      setErrorAllProjects(null);

      const response = await fetch('/api/projects?limit=1000');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setAllProjects(data.projects);
    } catch (error) {
      setErrorAllProjects(error instanceof Error ? error.message : 'Failed to fetch projects');
      console.error('Error fetching all projects:', error);
    } finally {
      setIsLoadingAllProjects(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      categories,
      initialProjects,
      userVotes,
      allProjects,
      isLoadingAllProjects,
      errorAllProjects,
      refetchAllProjects,
    }),
    [
      categories,
      initialProjects,
      userVotes,
      allProjects,
      isLoadingAllProjects,
      errorAllProjects,
      refetchAllProjects,
    ]
  );

  return <ProjectsContext.Provider value={contextValue}>{children}</ProjectsContext.Provider>;
};

export const useProjectsContext = (): IProjectsContext => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjectsContext must be used within a ProjectsContextProvider');
  }
  return context;
};
