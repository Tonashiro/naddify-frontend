import { HomePage } from "@/components/HomePage";
import { Spinner } from "@/components/Spinner";
import { PROJECTS_AMOUNT_LIMIT } from "@/constants";
import { revalidateTag } from "next/cache";
import { Suspense } from "react";

export default async function Home() {
  // // Fetch categories
  const categoriesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/categories`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!categoriesResponse.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories = await categoriesResponse.json();

  // Fetch stats
  const statsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stats`,
    {
      next: { revalidate: 60, tags: ["stats"] },
    }
  );

  if (!statsResponse.ok) {
    throw new Error("Failed to fetch stats");
  }

  const stats = await statsResponse.json();

  const revalidateData = async () => {
    "use server";

    revalidateTag("stats");
    revalidateTag("projects");
  };

  // Fetch the first page of projects
  const projectsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects?page=1&limit=${PROJECTS_AMOUNT_LIMIT}`,
    {
      next: { revalidate: 60, tags: ["projects"] },
    }
  );

  if (!projectsResponse.ok) {
    throw new Error("Failed to fetch projects");
  }

  const projectsData = await projectsResponse.json();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      }
    >
      <HomePage
        revalidateData={revalidateData}
        categories={categories}
        stats={stats}
        initialProjects={projectsData}
      />
    </Suspense>
  );
}
