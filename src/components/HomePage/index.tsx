'use client';

import { ICategory } from '@/app/api/categories/route';
import { IProject } from '@/app/api/projects/route';
import { IStats } from '@/app/api/stats/route';
import { TVoteType } from '@/app/api/votes/[projectId]/route';
import { Hero } from '@/components/Hero';
import { Switch } from '@/components/ui/switch';
import { Projects } from '@/components/Projects';
import { Spinner } from '@/components/Spinner';
import { StatsSection } from '@/components/StatsSection';
import { CategoriesCarousel } from '@/components/CategoriesCarousel';
import { PROJECTS_AMOUNT_LIMIT } from '@/constants';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { ProjectSearch } from '@/components/ProjectSearch';
import { TeamSection } from '@/components/TeamSection';

type TProjectVote = {
  id: string;
  projectId: string;
  projectName: string;
  voteType: TVoteType;
  createdAt: Date;
};

interface IUserVotes {
  totalVotes: number;
  votes: Array<TProjectVote>;
}

interface IHomePage {
  categories: ICategory[];
  stats: IStats;
  initialProjects: IProject[];
  userVotes: IUserVotes;
}

export const HomePage: React.FC<IHomePage> = ({
  categories,
  stats,
  initialProjects,
  userVotes,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Search query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['projectSearch', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return null;
      const res = await fetch(`/api/projects/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Failed to search projects');
      return res.json();
    },
    enabled: !!searchQuery,
  });

  // Original infinite query for projects
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['projects', selectedCategories, showOnlyNew],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const categoryParam = selectedCategories.join(',');

      const url = new URL(`/api/projects`, window.location.origin);
      url.searchParams.set('page', pageParam.toString());
      url.searchParams.set('limit', PROJECTS_AMOUNT_LIMIT.toString());
      if (categoryParam) url.searchParams.set('category', categoryParam);
      if (showOnlyNew) url.searchParams.set('onlyNew', 'true');

      const res = await fetch(url.toString(), { credentials: 'include' });

      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }

      //return res.json()

      const data = await res.json();

      if (data.projects.length === 0 && selectedCategories.length > 0) {
        setSelectedCategories([]);
      }

      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.page < lastPage.pagination.pages
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialData: {
      pages: [initialProjects],
      pageParams: [1],
    },
    refetchOnWindowFocus: 'always',
    refetchInterval: 60 * 1000,
    retry: 1,
  });

  const fetchNextPageCallback = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchNextPageCallback();
        }
      },
      { threshold: 0.25 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [fetchNextPageCallback]);

  // Map user votes to projects
  const projectsToDisplay = searchQuery
    ? (searchResults?.projects ?? []).map((project: IProject) => ({
        ...project,
        voteType: userVotes?.votes?.find((vote) => vote.projectId === project.id)?.voteType,
      }))
    : data?.pages
        .flatMap((page) => page.projects)
        .map((project: IProject) => ({
          ...project,
          voteType: userVotes?.votes?.find((vote) => vote.projectId === project.id)?.voteType,
        })) ?? [];

  //remove after backend is updated
  const allCategories = useMemo(() => {
    const devnadsCategory: ICategory = {
      id: 'devnads-temp-id',
      name: 'Devnads',
      description: 'Developer NADs Projects',
    };
    return [devnadsCategory, ...categories];
  }, [categories]);

  return (
    <div className="min-h-screen flex flex-col text-text-primary">
      <Hero />

      <StatsSection stats={statsData} />

      <div className="relative flex flex-col gap-4 sm:gap-6 mt-10 sm:mt-4">
        <div id="projects" />
        <div className="flex flex-col sm:gap-6 justify-center items-center gap-4">
          <Badge variant="default" className="font-bold">
            PROJECTS
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-300 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
            Browse Through Projects
          </h2>
          <p className="text-center text-lg sm:text-xl text-gray-300 leading-[140%] max-w-2xl mx-auto font-medium">
            Discover projects across various categories in the Monad ecosystem. From DeFi protocols
            to gaming platforms, find what interests you most.
          </p>
        </div>

        <div className="flex items-center gap-1 justify-center sm:hidden mt-2">
          <AlertCircle className="w-8 h-8" />
          <span className="text-center text-xs sm:text-sm text-gray-300">
            Disclaimer: Project sorting only considers MON, NAD, and OG votes. Full Access votes are
            not included
          </span>
        </div>

        <div className="w-full mt-0 sm:mt-[2%]">
          <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between">
            <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
              <AlertCircle />
              Disclaimer: Project sorting only considers MON, NAD, and OG votes. Full Access votes
              are not included
            </span>

            <div className="flex gap-4 items-end">
              <div className="flex items-center gap-2 w-full sm:text-nowrap">
                <span className="text-sm text-gray-300">Show only new projects</span>
                <Switch
                  checked={showOnlyNew}
                  onCheckedChange={(checked) => setShowOnlyNew(checked)}
                  className="data-[state=unchecked]:bg-purple-100 w-12 h-7"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-10 mb-4">
            <CategoriesCarousel
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              categories={allCategories}
              className="w-full sm:w-2/3"
            />
            <ProjectSearch className="w-full sm:w-1/3" onSearch={setSearchQuery} />
          </div>

          <Projects
            projects={projectsToDisplay}
            isLoading={searchQuery ? isSearching : isLoading}
          />
          {!searchQuery && !isLoading && (
            <div
              ref={loadMoreRef}
              className="min-h-20 w-fit mx-auto flex justify-center items-center"
            >
              {isFetchingNextPage && <Spinner />}
            </div>
          )}

          <TeamSection />
        </div>
      </div>
    </div>
  );
};
