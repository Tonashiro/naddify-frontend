import { notFound } from "next/navigation";
import { EditProjectPage } from "@/components/EditProjectPage";
import { Suspense } from "react";
import { Spinner } from "@/components/Spinner";

interface EditProjectProps {
  params: Promise<{ id: string }>;
}

export default async function EditProject({ params }: EditProjectProps) {
  const { id } = await params;

  // Fetch project data and categories in parallel
  const [projectResponse, categoryResponse] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${id}`),
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/categories`),
  ]);

  // Handle errors for project data
  if (!projectResponse.ok) {
    if (projectResponse.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch project data");
  }

  // Parse JSON responses
  const [projectData, categoryOptions] = await Promise.all([
    projectResponse.json(),
    categoryResponse.json(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      }
    >
      <EditProjectPage
        project={projectData}
        categoryOptions={categoryOptions}
      />
    </Suspense>
  );
}
