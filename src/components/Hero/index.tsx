'use client';

import React from 'react';
import { AddProjectCard } from '@/components/AddProjectCard';
import { useUserContext } from '@/contexts/userContext';
import Link from 'next/link';
import { LibraryBig } from 'lucide-react';

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
export const Hero: React.FC = () => {
  const { user } = useUserContext();

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section className="text-center max-w-3xl mx-auto relative mt-[64px] mb-[5%] pt-[5%]">
      <div className="relative">
        <h2 className="text-3xl sm:text-5xl line-height-normal font-bold bg-gradient-to-r from-purple-300 via-purple-500 to-indigo-400 bg-clip-text text-transparent mb-5 leading-[1.15]">
          Vote, Verify, Discover.
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-medium">
          Naddify is a platform for community-led project discovery on{' '}
          <Link
            href="https://testnet.monad.xyz"
            target="_blank"
            className="text-[#836EF9] font-bold text-xl sm:text-2xl"
          >
            {' '}
            Monad.
          </Link>{' '}
          Trusted community members vote and verify, helping you discover what truly deserves
          attention.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-6 gap-4 mt-8 mb-6">
        {user?.is_admin ? <AddProjectCard /> : <AddProjectCard type="submit" />}
        <a
          href="#projects"
          onClick={handleScrollToProjects}
          className="w-fit flex items-center justify-center gap-2 py-3 px-6 rounded-lg relative z-10 border-2 border-[#902EEC]/90 text-[#902EEC] hover:bg-[#902EEC]/10 transition-colors"
        >
          <LibraryBig className="hidden sm:block" size={16} />
          <p className="text-base sm:text-[18px] font-bold tracking-[1px]">BROWSE PROJECTS</p>
        </a>
      </div>
    </section>
  );
};
