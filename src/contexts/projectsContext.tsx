'use client';

import { ICategory } from '@/app/api/categories/route';
import { IProject } from '@/app/api/projects/route';
import { TVoteType } from '@/app/api/votes/[projectId]/route';
import { createContext, ReactNode, useContext, useMemo } from 'react';

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
  const contextValue = useMemo(
    () => ({
      categories,
      initialProjects,
      userVotes,
    }),
    [categories, initialProjects, userVotes],
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
