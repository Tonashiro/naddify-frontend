'use client';

import { useProjectsContext } from '@/contexts/projectsContext';
import { useProjectsByCategory } from '@/hooks/useProjectsByCategory';
import { VerifiedIcon } from '@/components/Icons/VerifiedIcon';
import { SectionHeader } from '../SectionHeader';
import Link from 'next/link';

export const ProjectsBubble = () => {
  const { allProjects } = useProjectsContext();
  const { getProjectsByCategory, getCategoriesByProjectCount } = useProjectsByCategory(allProjects);
  // Get categories sorted by project count (most popular first)
  const sortedCategories = getCategoriesByProjectCount();

  const allCategoriesWithProjects = sortedCategories.map((categoryName) => {
    return {
      name: categoryName,
      projects: getProjectsByCategory(categoryName),
    };
  });

  return (
    <div className="pt-14 sm:pt-20" id="categories-section">
      <SectionHeader
        title="CATEGORIES"
        subtitle="Browse Categories"
        description="Discover projects across various categories in the Monad ecosystem."
      />

      {/* Desktop */}
      <div className="hidden sm:block space-y-6 mt-10">
        <div className="flex justify-center gap-6">
          <div className="nfts w-2/3 bg-gray-100/5 rounded-lg p-6">
            <h2 className="text-base font-bold text-white mb-4 text-center">NFTs</h2>
            {allCategoriesWithProjects
              .filter((category) => category.name === 'NFT')
              .map((category) => (
                <div key={category.name} className="grid grid-cols-7 gap-6 place-items-center">
                  {category.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects?search=${encodeURIComponent(project.name)}`}
                      className="relative group cursor-pointer"
                    >
                      <div className="relative w-14 h-14 mx-auto">
                        <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                          <img
                            src={project.logo_url}
                            alt={project.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        {project.nads_verified && (
                          <div className="absolute -top-0.5 right-0.5 z-10">
                            <VerifiedIcon size={16} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="text-center mt-2">
                        <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                          {project.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
          </div>
          <div className="flex flex-col gap-6">
            <div className="defi w-full bg-gray-100/5 rounded-lg p-6">
              <h2 className="text-base font-bold text-white mb-4 text-center">DeFi</h2>
              {allCategoriesWithProjects
                .filter((category) => category.name === 'DeFi')
                .map((category) => (
                  <div key={category.name} className="grid place-items-center grid-cols-4 gap-6">
                    {category.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects?search=${encodeURIComponent(project.name)}`}
                        className="relative group cursor-pointer"
                      >
                        <div className="relative w-14 h-14 mx-auto">
                          <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                            <img
                              src={project.logo_url}
                              alt={project.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>

                          {project.nads_verified && (
                            <div className="absolute -top-0.5 right-0.5 z-10">
                              <VerifiedIcon size={16} className="text-white" />
                            </div>
                          )}
                        </div>

                        <div className="text-center mt-2">
                          <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                            {project.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
            </div>
            <div className="dex bg-gray-100/5 rounded-lg p-6 w-full h-full">
              <h2 className="text-base font-bold text-white mb-4 text-center">DEX</h2>
              {allCategoriesWithProjects
                .filter((category) => category.name === 'DEX')
                .map((category) => (
                  <div key={category.name} className="grid grid-cols-4 gap-6 place-items-center">
                    {category.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects?search=${encodeURIComponent(project.name)}`}
                        className="relative group cursor-pointer"
                      >
                        <div className="relative w-14 h-14 mx-auto">
                          <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                            <img
                              src={project.logo_url}
                              alt={project.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>

                          {project.nads_verified && (
                            <div className="absolute -top-0.5 right-0.5 z-10">
                              <VerifiedIcon size={16} className="text-white" />
                            </div>
                          )}
                        </div>

                        <div className="text-center mt-2">
                          <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                            {project.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="perps bg-gray-100/5 rounded-lg p-6 w-2/6">
            <h2 className="text-base font-bold text-white mb-4 text-center">Perps</h2>
            {allCategoriesWithProjects
              .filter((category) => category.name === 'Perps')
              .map((category) => (
                <div key={category.name} className="grid place-items-center grid-cols-2 gap-6">
                  {category.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects?search=${encodeURIComponent(project.name)}`}
                      className="relative group cursor-pointer"
                    >
                      <div className="relative w-14 h-14 mx-auto">
                        <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                          <img
                            src={project.logo_url}
                            alt={project.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        {project.nads_verified && (
                          <div className="absolute -top-0.5 right-0.5 z-10">
                            <VerifiedIcon size={16} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="text-center mt-2">
                        <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                          {project.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
          </div>

          <div className="gaming bg-gray-100/5 rounded-lg p-6 w-3/6">
            <h2 className="text-base font-bold text-white mb-4 text-center">Gaming</h2>
            {allCategoriesWithProjects
              .filter((category) => category.name === 'Gaming')
              .map((category) => (
                <div key={category.name} className="grid grid-cols-3 place-items-center gap-6">
                  {category.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects?search=${encodeURIComponent(project.name)}`}
                      className="relative group cursor-pointer"
                    >
                      <div className="relative w-14 h-14 mx-auto">
                        <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                          <img
                            src={project.logo_url}
                            alt={project.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        {project.nads_verified && (
                          <div className="absolute -top-0.5 right-0.5 z-10">
                            <VerifiedIcon size={16} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="text-center mt-2">
                        <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                          {project.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
          </div>

          <div className="devnads bg-gray-100/5 rounded-lg p-6 w-1/6">
            <h2 className="text-base font-bold text-white mb-4 text-center">Devnads</h2>
            {allCategoriesWithProjects
              .filter((category) => category.name === 'Devnads')
              .map((category) => (
                <div key={category.name} className="grid place-items-center gap-6">
                  {category.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects?search=${encodeURIComponent(project.name)}`}
                      className="relative group cursor-pointer"
                    >
                      <div className="relative w-14 h-14 mx-auto">
                        <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                          <img
                            src={project.logo_url}
                            alt={project.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        {project.nads_verified && (
                          <div className="absolute -top-0.5 right-0.5 z-10">
                            <VerifiedIcon size={16} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="text-center mt-2">
                        <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                          {project.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="betting bg-gray-100/5 rounded-lg p-6 w-1/2">
            <h2 className="text-base font-bold text-white mb-4 text-center">Betting</h2>
            {allCategoriesWithProjects
              .filter((category) => category.name === 'Betting')
              .map((category) => (
                <div key={category.name} className="grid grid-cols-3 place-items-center">
                  {category.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects?search=${encodeURIComponent(project.name)}`}
                      className="relative group cursor-pointer"
                    >
                      <div className="relative w-14 h-14 mx-auto">
                        <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                          <img
                            src={project.logo_url}
                            alt={project.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        {project.nads_verified && (
                          <div className="absolute -top-0.5 right-0.5 z-10">
                            <VerifiedIcon size={16} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="text-center mt-2">
                        <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                          {project.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
          </div>

          <div className="prediction-market bg-gray-100/5 rounded-lg p-6 w-1/2">
            <h2 className="text-base font-bold text-white mb-4 text-center">Predictions</h2>
            {allCategoriesWithProjects
              .filter((category) => category.name === 'Prediction Market')
              .map((category) => (
                <div key={category.name} className="grid grid-cols-3 place-items-center">
                  {category.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects?search=${encodeURIComponent(project.name)}`}
                      className="relative group cursor-pointer"
                    >
                      <div className="relative w-14 h-14 mx-auto">
                        <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                          <img
                            src={project.logo_url}
                            alt={project.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        {project.nads_verified && (
                          <div className="absolute -top-0.5 right-0.5 z-10">
                            <VerifiedIcon size={16} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="text-center mt-2">
                        <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                          {project.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden space-y-6 mt-10">
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="nfts w-full bg-gray-100/5 rounded-lg p-6">
            <h2 className="text-base font-bold text-white mb-4 text-center">NFTs</h2>
            {allCategoriesWithProjects
              .filter((category) => category.name === 'NFT')
              .map((category) => (
                <div key={category.name} className="grid grid-cols-3 gap-6 place-items-center">
                  {category.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects?search=${encodeURIComponent(project.name)}`}
                      className="relative group cursor-pointer"
                    >
                      <div className="relative w-14 h-14 mx-auto">
                        <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                          <img
                            src={project.logo_url}
                            alt={project.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        {project.nads_verified && (
                          <div className="absolute -top-0.5 right-0.5 z-10">
                            <VerifiedIcon size={16} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="text-center mt-2">
                        <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                          {project.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
          </div>
          <div className="defi w-full bg-gray-100/5 rounded-lg p-6">
            <h2 className="text-base font-bold text-white mb-4 text-center">DeFi</h2>
            {allCategoriesWithProjects
              .filter((category) => category.name === 'DeFi')
              .map((category) => (
                <div key={category.name} className="grid place-items-center grid-cols-3 gap-6">
                  {category.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects?search=${encodeURIComponent(project.name)}`}
                      className="relative group cursor-pointer"
                    >
                      <div className="relative w-14 h-14 mx-auto">
                        <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                          <img
                            src={project.logo_url}
                            alt={project.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        {project.nads_verified && (
                          <div className="absolute -top-0.5 right-0.5 z-10">
                            <VerifiedIcon size={16} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="text-center mt-2">
                        <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                          {project.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <div className="w-full sm:w-2/5 flex flex-col sm:flex-row items-center gap-6">
            <div className="dex bg-gray-100/5 rounded-lg p-6 w-full">
              <h2 className="text-base font-bold text-white mb-4 text-center">DEX</h2>
              {allCategoriesWithProjects
                .filter((category) => category.name === 'DEX')
                .map((category) => (
                  <div key={category.name} className="grid grid-cols-3 gap-6 place-items-center">
                    {category.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects?search=${encodeURIComponent(project.name)}`}
                        className="relative group cursor-pointer"
                      >
                        <div className="relative w-14 h-14 mx-auto">
                          <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                            <img
                              src={project.logo_url}
                              alt={project.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>

                          {project.nads_verified && (
                            <div className="absolute -top-0.5 right-0.5 z-10">
                              <VerifiedIcon size={16} className="text-white" />
                            </div>
                          )}
                        </div>

                        <div className="text-center mt-2">
                          <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                            {project.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
            </div>
            <div className="perps bg-gray-100/5 rounded-lg p-6 w-full">
              <h2 className="text-base font-bold text-white mb-4 text-center">Perps</h2>
              {allCategoriesWithProjects
                .filter((category) => category.name === 'Perps')
                .map((category) => (
                  <div key={category.name} className="grid place-items-center grid-cols-3 gap-6">
                    {category.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects?search=${encodeURIComponent(project.name)}`}
                        className="relative group cursor-pointer"
                      >
                        <div className="relative w-14 h-14 mx-auto">
                          <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                            <img
                              src={project.logo_url}
                              alt={project.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>

                          {project.nads_verified && (
                            <div className="absolute -top-0.5 right-0.5 z-10">
                              <VerifiedIcon size={16} className="text-white" />
                            </div>
                          )}
                        </div>

                        <div className="text-center mt-2">
                          <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                            {project.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full flex flex-col items-center gap-6">
            <div className="gaming bg-gray-100/5 rounded-lg p-6">
              <h2 className="text-base font-bold text-white mb-4 text-center">Gaming</h2>
              {allCategoriesWithProjects
                .filter((category) => category.name === 'Gaming')
                .map((category) => (
                  <div key={category.name} className="grid place-items-center grid-cols-3 gap-6">
                    {category.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects?search=${encodeURIComponent(project.name)}`}
                        className="relative group cursor-pointer"
                      >
                        <div className="relative w-14 h-14 mx-auto">
                          <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                            <img
                              src={project.logo_url}
                              alt={project.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>

                          {project.nads_verified && (
                            <div className="absolute -top-0.5 right-0.5 z-10">
                              <VerifiedIcon size={16} className="text-white" />
                            </div>
                          )}
                        </div>

                        <div className="text-center mt-2">
                          <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                            {project.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
            </div>
            <div className="prediction-market bg-gray-100/5 rounded-lg p-6">
              <h2 className="text-base font-bold text-white mb-4 text-center">Predictions</h2>
              {allCategoriesWithProjects
                .filter((category) => category.name === 'Prediction Market')
                .map((category) => (
                  <div key={category.name} className="grid place-items-center grid-cols-3 w-full">
                    {category.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects?search=${encodeURIComponent(project.name)}`}
                        className="relative group cursor-pointer"
                      >
                        <div className="relative w-14 h-14 mx-auto">
                          <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                            <img
                              src={project.logo_url}
                              alt={project.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>

                          {project.nads_verified && (
                            <div className="absolute -top-0.5 right-0.5 z-10">
                              <VerifiedIcon size={16} className="text-white" />
                            </div>
                          )}
                        </div>

                        <div className="text-center mt-2">
                          <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                            {project.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
            </div>
            <div className="betting bg-gray-100/5 rounded-lg p-6 w-full">
              <h2 className="text-base font-bold text-white mb-4 text-center">Betting</h2>
              {allCategoriesWithProjects
                .filter((category) => category.name === 'Betting')
                .map((category) => (
                  <div key={category.name} className="grid place-items-center grid-cols-3 w-full">
                    {category.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects?search=${encodeURIComponent(project.name)}`}
                        className="relative group cursor-pointer"
                      >
                        <div className="relative w-14 h-14 mx-auto">
                          <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                            <img
                              src={project.logo_url}
                              alt={project.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>

                          {project.nads_verified && (
                            <div className="absolute -top-0.5 right-0.5 z-10">
                              <VerifiedIcon size={16} className="text-white" />
                            </div>
                          )}
                        </div>

                        <div className="text-center mt-2">
                          <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                            {project.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
            </div>

            <div className="devnads bg-gray-100/5 rounded-lg p-6 w-full">
              <h2 className="text-base font-bold text-white mb-4 text-center">Devnads</h2>
              {allCategoriesWithProjects
                .filter((category) => category.name === 'Devnads')
                .map((category) => (
                  <div key={category.name} className="grid place-items-center grid-cols-3">
                    {category.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects?search=${encodeURIComponent(project.name)}`}
                        className="relative group cursor-pointer"
                      >
                        <div className="relative w-14 h-14 mx-auto">
                          <div className="w-full h-full rounded-full bg-gray-700 border border-gray-600 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group-hover:scale-110">
                            <img
                              src={project.logo_url}
                              alt={project.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>

                          {project.nads_verified && (
                            <div className="absolute -top-0.5 right-0.5 z-10">
                              <VerifiedIcon size={16} className="text-white" />
                            </div>
                          )}
                        </div>

                        <div className="text-center mt-2">
                          <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
                            {project.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
