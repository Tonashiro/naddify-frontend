'use client';

import { IVotesStatsResponse } from '@/app/api/votes/me/route';
import { Leaderboard } from '@/components/Leaderboard';
import { UserInfoCard } from '@/components/UserInfoCard';
import { UserProfile } from '@/components/UserProfile';
import { useUserContext } from '@/contexts/userContext';
import React from 'react';

interface IProfilePage {
  statsData: IVotesStatsResponse;
}

export const ProfilePage: React.FC<IProfilePage> = ({ statsData }) => {
  const { user } = useUserContext();

  return (
    <div className="flex flex-col mt-[64px] pt-[5%] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 gap-10">
      <UserProfile user={user} />
      <UserInfoCard totalVotes={statsData.totalVotes} />
      <Leaderboard />
    </div>
  );
};
