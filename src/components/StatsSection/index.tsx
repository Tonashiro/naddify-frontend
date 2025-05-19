"use client";

import React from "react";
import { IStats } from "@/app/api/stats/route";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IStatsSectionProps {
  stats: IStats;
}

export const StatsSection: React.FC<IStatsSectionProps> = ({ stats }) => {
  return (
    <section className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto gap-4 mb-[5%] text-white">
      {/* Highlighted Stat */}
      <Card
        className={cn(
          "w-full bg-gradient-to-t from-purple-700 via-purple-800 to-indigo-900 text-white shadow-lg border-0"
        )}
      >
        <CardContent className="flex flex-col items-center justify-center">
          <AnimatedNumber total={stats?.totalVotes} />
          <CardTitle className="text-lg sm:text-xl mt-2">Total Votes</CardTitle>
        </CardContent>
      </Card>

      {/* Other Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <Card className="text-center bg-gradient-to-r from-zinc-900 via-neutral-900 to-zinc-800 shadow-md">
          <CardContent>
            <AnimatedNumber total={stats?.totalProjects} />
            <CardTitle className="text-md sm:text-lg">
              Total Projects
            </CardTitle>
          </CardContent>
        </Card>
        <Card className="text-center bg-gradient-to-r from-zinc-900 via-neutral-900 to-zinc-800 shadow-md">
          <CardContent>
            <AnimatedNumber total={stats?.uniqueVoters} />
            <CardTitle className="text-md sm:text-lg">
              Unique voters
            </CardTitle>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
