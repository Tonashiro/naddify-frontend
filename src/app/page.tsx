"use client";

import { useQuery } from "@tanstack/react-query";
import { IProject } from "@/app/api/projects/route";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";

export default function Home() {
  const { data, isLoading } = useQuery<{
    projects: IProject[];
  }>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch(`/api/projects`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }

      return res.json();
    },
    refetchOnWindowFocus: true,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col mx-auto w-full px-[5%] max-w-[1920px] text-text-primary">
      <Hero />
      <Projects projects={data?.projects ?? []} />
    </div>
  );
}
