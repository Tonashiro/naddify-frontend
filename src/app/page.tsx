import { HomePage } from '@/components/HomePage';
import { Spinner } from '@/components/Spinner';
import { Suspense } from 'react';

export default async function Home() {
  // Only fetch stats here since projects data is now in layout
  const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stats`, {
    next: { revalidate: 1 },
  });

  if (!statsResponse.ok) {
    throw new Error('Failed to fetch stats');
  }

  const stats = await statsResponse.json();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      }
    >
      <HomePage stats={stats} />
    </Suspense>
  );
}
