'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { useProjectsContext } from '@/contexts/projectsContext';
import { SectionHeader } from '@/components/SectionHeader';
import Link from 'next/link';
import { useFilteredCategories } from '@/hooks/useFilteredCategories';

export const Categories = () => {
  const { categories, initialProjects } = useProjectsContext();
  const { filteredCategories } = useFilteredCategories(categories, initialProjects);

  return (
    <div className="relative container mx-auto mt-16 pt-[5%] pb-8">
      <SectionHeader
        title="CATEGORIES"
        subtitle="Browse Categories"
        description="Discover projects across various categories in the Monad ecosystem."
      />

      <div className="flex justify-center items-center flex-wrap sm:px-8 gap-4 sm:gap-6 max-w-7xl mx-auto mt-10">
        {filteredCategories.map((category) => (
          <Link href={`/projects?category=${category.name.toLowerCase()}`} key={category.id}>
            <Card
              className={`${
                category.name === 'Devnads'
                  ? 'bg-amber-400 hover:bg-amber-400/90 hover:shadow-[0_4px_8px_rgba(245,158,11,0.3),0_0_0_1px_rgba(245,158,11,0.35)]'
                  : 'bg-gray-100/7 hover:bg-gray-100/10 hover:shadow-[0_4px_8px_rgba(168,85,247,0.2),0_0_0_1px_rgba(168,85,247,0.25)]'
              } transition-all duration-300 cursor-pointer group hover:scale-105 py-4 rounded-2xl shadow-lg`}
            >
              <CardTitle className="text-white tracking-wider text-xs sm:text-sm uppercase text-center">
                {category.name}
              </CardTitle>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
