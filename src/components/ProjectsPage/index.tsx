'use client';

import { Switch } from '@/components/ui/switch';
import { AlertCircle } from 'lucide-react';
import { CategoriesCarousel } from '@/components/CategoriesCarousel';
import { Projects } from '@/components/Projects';
import { ProjectSearch } from '@/components/ProjectSearch';
import { Spinner } from '@/components/Spinner';
import { useProjectsContext } from '@/contexts/projectsContext';
import { useFilteredCategories } from '@/hooks/useFilteredCategories';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { ONE_WEEK_MS, PROJECTS_AMOUNT_LIMIT } from '@/constants';

interface ProjectsPageProps {
  initialSearchQuery?: string;
}

export const ProjectsPage = ({ initialSearchQuery = '' }: ProjectsPageProps) => {
  const { categories, allProjects, userVotes } = useProjectsContext();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchQuery, showOnlyNew]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const hasDevnadsCategory = project.categories.some((cat) => cat.name === 'Devnads');

      if (
        hasDevnadsCategory &&
        !selectedCategories.includes('89fef89f-086a-4ee4-a300-219cdfb74340')
      ) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const hasSelectedCategory = project.categories.some((cat) =>
          selectedCategories.includes(cat.id)
        );
        if (!hasSelectedCategory) return false;
      }

      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          project.name.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // "Show only new" filter
      if (showOnlyNew) {
        const projectDate = new Date(project.created_at || '');
        const cutoffDate = new Date(Date.now() - ONE_WEEK_MS);
        if (projectDate < cutoffDate) return false;
      }

      return true;
    });
  }, [allProjects, selectedCategories, searchQuery, showOnlyNew]);

  const paginatedProjects = filteredProjects.slice(0, currentPage * PROJECTS_AMOUNT_LIMIT);
  const hasMore = paginatedProjects.length < filteredProjects.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.25 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loadMore, hasMore]);

  const projectsToDisplay = paginatedProjects.map((project) => ({
    ...project,
    voteType: userVotes?.votes?.find((vote) => vote.projectId === project.id)?.voteType,
  }));

  const { filteredCategories } = useFilteredCategories(categories, {
    projects: allProjects,
  });

  return (
    <div
      id="projects-section"
      className="relative flex flex-col gap-4 sm:gap-6 mt-16 sm:mt-12 pt-[5%]"
    >
      <SectionHeader
        title="PROJECTS"
        subtitle="Explore Projects"
        description="From DeFi protocols to gaming platforms, find what interests you most."
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
            onCategorySelect={() => setSearchQuery('')}
          />
          <ProjectSearch
            className="w-full sm:w-1/3"
            onSearch={setSearchQuery}
            initialValue={searchQuery}
          />
        </div>

        <Projects projects={projectsToDisplay} isLoading={false} />

        {hasMore && (
          <div
            ref={loadMoreRef}
            className="min-h-20 w-fit mx-auto flex justify-center items-center"
          >
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};
