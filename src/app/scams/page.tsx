"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { IProject } from "@/app/api/projects/route";
import { Projects } from "@/components/Projects";
import { useCallback, useEffect, useRef } from "react";
import { Spinner } from "@/components/Spinner";
import { PROJECTS_AMOUNT_LIMIT } from "@/constants";

export default function Scams() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<{
      projects: IProject[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    }>({
      queryKey: ["scamProjects"],
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const res = await fetch(
          `/api/projects?status=SCAM&page=${pageParam}&limit=${PROJECTS_AMOUNT_LIMIT}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch scam projects");
        }
        return res.json();
      },
      getNextPageParam: (lastPage) => {
        const nextPage =
          lastPage.pagination.page < lastPage.pagination.pages
            ? lastPage.pagination.page + 1
            : undefined;
        return nextPage;
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Spinner />
      </div>
    );
  }

  const allProjects = data?.pages.flatMap((page) => page.projects) ?? [];

  return (
    <div className="min-h-screen flex flex-col mx-auto w-full px-[5%] pt-[10%] max-w-[1920px] text-text-primary">
      <Projects projects={allProjects} />

      <div ref={loadMoreRef} className="h-12 flex justify-center items-center">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
}
