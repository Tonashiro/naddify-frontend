'use client';

import { Switch } from '@/components/ui/switch';
import { AlertCircle } from 'lucide-react';
import { CategoriesCarousel } from '@/components/CategoriesCarousel';
import { Projects } from '@/components/Projects';
import { ProjectSearch } from '@/components/ProjectSearch';
import { Spinner } from '@/components/Spinner';
import { PROJECTS_AMOUNT_LIMIT } from '@/constants';
import { useProjectsContext } from '@/contexts/projectsContext';
import { useFilteredCategories } from '@/hooks/useFilteredCategories';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SectionHeader } from '@/components/SectionHeader';

export const ProjectsPage = () => {
  const { categories, initialProjects, userVotes } = useProjectsContext();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Initialize selected categories from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== 'all') {
      const category = categories.find(
        (cat) => cat.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (category) {
        setSelectedCategories([category.id]);
      }
    }
  }, [searchParams, categories]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['projects', selectedCategories, showOnlyNew, searchQuery],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const categoryParam = selectedCategories.join(',');

      const url = new URL(`/api/projects`, window.location.origin);
      url.searchParams.set('page', pageParam.toString());
      url.searchParams.set('limit', PROJECTS_AMOUNT_LIMIT.toString());
      if (categoryParam) url.searchParams.set('category', categoryParam);
      if (showOnlyNew) url.searchParams.set('onlyNew', 'true');
      if (searchQuery) url.searchParams.set('q', searchQuery);

      const res = await fetch(url.toString(), { credentials: 'include' });

      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }

      return res.json();
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
  const projectsToDisplay =
    data?.pages
      .flatMap((page) => page.projects)
      .map((project) => ({
        ...project,
        voteType: userVotes?.votes?.find((vote) => vote.projectId === project.id)?.voteType,
      })) ?? [];

  const { filteredCategories } = useFilteredCategories(categories, initialProjects);

  return (
    <div className="relative flex flex-col gap-4 sm:gap-6 mt-16 sm:mt-12 pt-[5%]">
      <SectionHeader
        subtitle="Explore Projects"
        description="Discover projects across various categories in the Monad ecosystem. From DeFi protocols to gaming platforms, find what interests you most."
      />

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
            Disclaimer: Project sorting only considers MON, NAD, and OG votes. Full Access votes are
            not included
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
            categories={filteredCategories}
            className="w-full sm:w-2/3"
          />
          <ProjectSearch className="w-full sm:w-1/3" onSearch={setSearchQuery} />
        </div>

        <Projects projects={projectsToDisplay} isLoading={isLoading} />
        {!searchQuery && !isLoading && (
          <div
            ref={loadMoreRef}
            className="min-h-20 w-fit mx-auto flex justify-center items-center"
          >
            {isFetchingNextPage && <Spinner />}
          </div>
        )}
      </div>
    </div>
  );
};
