"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { ProjectFilter } from "@/components/ProjectFilter";
import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/Spinner";
import { PROJECTS_AMOUNT_LIMIT } from "@/constants";
import { TProjectStatus } from "@/app/api/projects/route";

export default function Home() {
  const [selectedStatuses, setSelectedStatuses] = useState<TProjectStatus[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const queryKey = ["projects", selectedStatuses, selectedCategories];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey,
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const statusParam = selectedStatuses.join(",");
        const categoryParam = selectedCategories.join(",");

        const url = new URL(`/api/projects`, window.location.origin);
        url.searchParams.set("page", pageParam.toString());
        url.searchParams.set("limit", PROJECTS_AMOUNT_LIMIT.toString());
        if (statusParam) url.searchParams.set("status", statusParam);
        if (categoryParam) url.searchParams.set("category", categoryParam);

        const res = await fetch(url.toString(), {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }

        return res.json();
      },
      getNextPageParam: (lastPage) => {
        return lastPage.pagination.page < lastPage.pagination.pages
          ? lastPage.pagination.page + 1
          : undefined;
      },
      refetchOnWindowFocus: "always",
      staleTime: 60 * 1000,
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
      { threshold: 1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [fetchNextPageCallback]);

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      return res.json();
    },
  });

  useEffect(() => {
    if (!isLoading && !isLoadingCategories && data && categories) {
      setIsInitialLoadComplete(true);
    }
  }, [isLoading, isLoadingCategories, categories, data]);

  const allProjects =
    data?.pages
      .flatMap((page) => page.projects)
      .filter((project) => project.status !== "SCAM") ?? [];

  const isInitialLoading =
    !isInitialLoadComplete && (isLoading || isLoadingCategories);

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col mx-auto w-full px-[5%] max-w-[1920px] text-text-primary">
      <Hero />

      {isLoadingCategories ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="relative flex flex-col lg:flex-row gap-6">
          <ProjectFilter
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            categories={categories}
          />

          <div className="flex-1">
            <Projects projects={allProjects} />
            <div
              ref={loadMoreRef}
              className="h-12 flex justify-center items-center"
            >
              {(isFetchingNextPage || isLoading) && <Spinner />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
