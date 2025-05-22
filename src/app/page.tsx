import { HomePage } from "@/components/HomePage";
import { Spinner } from "@/components/Spinner";
import { PROJECTS_AMOUNT_LIMIT } from "@/constants";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function Home() {
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token")?.value;

  // Fetch categories, stats, and projects in parallel
  const [categoriesResponse, statsResponse, projectsResponse] =
    await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/categories`),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stats`, {
        next: { revalidate: 1 },
      }),
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects?page=1&limit=${PROJECTS_AMOUNT_LIMIT}`,
        {
          next: { revalidate: 1, tags: ["projects"] },
        }
      ),
    ]);

  if (!categoriesResponse.ok) {
    throw new Error("Failed to fetch categories");
  }
  if (!statsResponse.ok) {
    throw new Error("Failed to fetch stats");
  }
  if (!projectsResponse.ok) {
    throw new Error("Failed to fetch projects");
  }

  const [categories, stats, projectsData] = await Promise.all([
    categoriesResponse.json(),
    statsResponse.json(),
    projectsResponse.json(),
  ]);

  // Fetch user votes only if a token is available
  const userVotes = token
    ? await (async () => {
        const userVotesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/votes/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            next: { revalidate: 60, tags: ["votes"] },
          }
        );

        if (!userVotesResponse.ok) {
          console.error("Failed to fetch user votes");
          return null; // Return null if the request fails
        }

        return userVotesResponse.json();
      })()
    : null; // Return null if no token is available

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      }
    >
      <HomePage
        categories={categories}
        stats={stats}
        initialProjects={projectsData}
        userVotes={userVotes}
      />
    </Suspense>
  );
}
