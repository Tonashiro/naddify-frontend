import { notFound } from "next/navigation";
import { EditProjectPage } from "@/components/EditProjectPage";
import { Suspense } from "react";
import { Spinner } from "@/components/Spinner";

export default async function EditProject({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // Fetch project data
  const projectResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${id}`
  );

  if (!projectResponse.ok) {
    if (projectResponse.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch project data");
  }

  const projectData = await projectResponse.json();

  // Fetch categories
  const categoryResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/categories`
  );
  const categoryOptions = await categoryResponse.json();

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
