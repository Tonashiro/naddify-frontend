import { Suspense } from 'react';
import { ProjectsPage } from '@/components/ProjectsPage';
import { Spinner } from '@/components/Spinner';

export default async function Projects() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      }
    >
      <ProjectsPage />
    </Suspense>
  );
}
