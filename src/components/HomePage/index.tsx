'use client';

import { IStats } from '@/app/api/stats/route';
import { Hero } from '@/components/Hero';
import { StatsSection } from '@/components/StatsSection';
import { useQuery } from '@tanstack/react-query';
import { ProjectsBubble } from '../ProjectsBubble';
import { ProjectsPage } from '../ProjectsPage';

interface IHomePage {
  stats: IStats;
}

export const HomePage: React.FC<IHomePage> = ({ stats }) => {
  // Fetch stats using React Query
  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }

      return res.json();
    },
    initialData: stats,
    refetchOnWindowFocus: 'always',
    refetchInterval: 60 * 1000,
    retry: 1,
  });

  return (
    <div className="flex flex-col text-text-primary">
      <Hero />

      <StatsSection stats={statsData} />

      <ProjectsBubble />

      <ProjectsPage />
    </div>
  );
};
