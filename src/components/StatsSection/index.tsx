'use client'

import React from 'react'
import { IStats } from '@/app/api/stats/route'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'

interface IStatsSectionProps {
  stats: IStats
}

export const StatsSection: React.FC<IStatsSectionProps> = ({ stats }) => {
  return (
    <section className="flex flex-col sm:flex-row md:flex-wrap lg:flex-nowrap items-center justify-center w-full max-w-4xl mx-auto gap-6 mb-[10%] mt-6 sm:mt-0">
      <Card className="flex-1 flex items-center justify-center p-4 sm:p-6 rounded-2xl shadow-lg bg-gray-100/7 gap-4 sm:gap-6 min-w-[295.5px] max-w-[440px]">
        <CardTitle className="text-[#D6BBFB] text-xs sm:text-sm uppercase text-center">
          Total Votes
        </CardTitle>
        <AnimatedNumber total={stats?.totalVotes} />
        <CardDescription className="text-[11px] sm:text-xs text-[#D6BBFB] text-center mt-1">
          All votes cast across all projects available for voting
        </CardDescription>
      </Card>

      <Card className="flex-1 flex items-center justify-center p-4 sm:p-6 rounded-2xl shadow-lg bg-gray-100/7 gap-4 sm:gap-6 min-w-[295.5px] max-w-[440px]">
        <CardTitle className="text-[#D6BBFB] text-xs sm:text-sm uppercase text-center">
          Total Projects
        </CardTitle>
        <AnimatedNumber total={stats?.totalProjects} />
        <CardDescription className="text-[11px] sm:text-xs text-[#D6BBFB] text-center mt-1">
          Number of projects available for voting activities
        </CardDescription>
      </Card>
      <Card className="flex-1 flex items-center justify-center p-4 sm:p-6 rounded-2xl shadow-lg bg-gray-100/7 gap-4 sm:gap-6 min-w-[295.5px] max-w-[440px]">
        <CardTitle className="text-[#D6BBFB] text-xs sm:text-sm uppercase text-center">
          Unique voters
        </CardTitle>
        <AnimatedNumber total={stats?.uniqueVoters} />
        <CardDescription className="text-[11px] sm:text-xs text-[#D6BBFB] text-center mt-1">
          Individual users who have participated in voting
        </CardDescription>
      </Card>
    </section>
  )
}
