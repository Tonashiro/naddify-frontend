import { IVotesStatsResponse } from '@/app/api/votes/me/route';
import { ProfilePage } from '@/components/ProfilePage';
import { Spinner } from '@/components/Spinner';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function Profile() {
  const cookieStorage = await cookies();
  const token = cookieStorage.get('token')?.value;

  if (!token) {
    console.error('Unauthorized: No token found');
    redirect('/');
  }

  // Fetch votes stats
  const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/votes/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 },
  });

  if (!statsResponse.ok) {
    throw new Error('Failed to fetch votes stats');
  }

  const statsData: IVotesStatsResponse = await statsResponse.json();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      }
    >
      <ProfilePage statsData={statsData} />
    </Suspense>
  );
}
