"use client";

import React from "react";
import Image from "next/image";
import { AddProjectCard } from "@/components/AddProjectCard";
import { useUserContext } from "@/contexts/userContext";
import { IStats } from "@/app/api/stats/route";
import { AnimatedNumber } from "@/components/AnimatedNumber";

interface IHero {
  stats: IStats;
}

/**
 * The `Hero` component is a React functional component that renders a hero section
 * for showcasing ecosystem projects. It includes a title, a description, an image,
 * and statistics about total votes and unique voters.
 *
 * @component
 * @returns {JSX.Element} The rendered hero section.
 *
 * @example
 * ```tsx
 * import { Hero } from './Hero';
 *
 * const App = () => (
 *   <div>
 *     <Hero />
 *   </div>
 * );
 * ```
 */
export const Hero: React.FC<IHero> = ({ stats }) => {
  const { user } = useUserContext();

  return (
    <section className="text-center max-w-3xl mx-auto relative my-[10%]">
      <div className="relative">
        <h2 className="text-3xl sm:text-5xl line-height-normal font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-5 leading-[1.15]">
          Ecosystem Projects
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-medium">
          Discover and vote on the growing ecosystem of projects building on{" "}
        </p>
        <Image
          alt="Monad Logo"
          src="/images/monad-logo.svg"
          width={140}
          height={28}
          className="h-6 sm:h-7 w-auto flex mx-auto mt-6"
          priority
        />
      </div>
      <div className="flex items-center justify-center gap-8 mt-6 mb-6">
        <div className="text-center">
          <AnimatedNumber total={stats?.totalProjects ?? 0} />
          <div className="text-md text-gray-400 mt-1">Projects</div>
        </div>
        <div className="text-center">
          <AnimatedNumber total={stats?.totalVotes ?? 0} />
          <div className="text-md text-gray-400 mt-1">Total Votes</div>
        </div>
        <div className="text-center">
          <AnimatedNumber total={stats?.uniqueVoters ?? 0} />
          <div className="text-md text-gray-400 mt-1">Unique Voters</div>
        </div>
      </div>

      {user?.is_admin && <AddProjectCard />}
    </section>
  );
};
