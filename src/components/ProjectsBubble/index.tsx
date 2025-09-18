/**
 * @title ProjectsBubble Component
 * @notice Main component for displaying project categories in a responsive grid layout
 *
 * @dev This component manages the overall layout of project categories, handling both desktop
 * and mobile views. It uses a configuration-based approach for flexible layouts:
 *
 * Key features:
 * - Responsive design with different layouts for desktop/mobile
 * - Configuration-driven layout using CATEGORY_LAYOUTS and CATEGORY_GROUPS
 * - Nested section support for complex layouts (e.g., DeFi/DEX column)
 * - Efficient category lookup using Map
 *
 * Layout Structure:
 * - Desktop: Uses CATEGORY_GROUPS for complex nested layouts
 * - Mobile: Uses MOBILE_CATEGORY_ORDER for simplified column layout
 *
 * @notice The component relies on BubbleSection for rendering individual category sections
 *
 * @param onProjectClick - Callback function triggered when a project is clicked
 */

'use client';

import { useProjectsContext } from '@/contexts/projectsContext';
import { SectionHeader } from '../SectionHeader';
import { BubbleSection } from '../BubbleSection';

interface ProjectsBubbleProps {
  onProjectClick: (projectName: string) => void;
}

export interface BubbleLayout {
  width: string;
  gridCols: string;
  height?: string;
}

interface BubbleGroup {
  categories: string[];
  containerClass: string;
  wrapperClass?: string;
  sections?: BubbleSection[];
}

interface BubbleSection {
  categories: string[];
  containerClass: string;
}

const CATEGORY_LAYOUTS: Record<string, BubbleLayout> = {
  NFT: { width: 'w-full', gridCols: 'grid-cols-5' },
  DeFi: { width: 'w-full', gridCols: 'grid-cols-3', height: 'h-full' },
  DEX: { width: 'w-full', gridCols: 'grid-cols-3', height: 'h-full' },
  Perps: { width: 'w-2/6', gridCols: 'grid-cols-2' },
  Gaming: { width: 'w-3/6', gridCols: 'grid-cols-3' },
  Devnads: { width: 'w-1/6', gridCols: 'grid-cols-1' },
  Betting: { width: 'w-1/2', gridCols: 'grid-cols-3' },
  'Prediction Market': { width: 'w-1/2', gridCols: 'grid-cols-3' },
};

// Configuration for how categories are grouped in the layout
const CATEGORY_GROUPS: BubbleGroup[] = [
  {
    categories: ['NFT'],
    containerClass: 'flex justify-center gap-6',
    wrapperClass: 'w-2/3',
    sections: [
      {
        categories: ['DeFi', 'DEX'],
        containerClass: 'flex flex-col gap-6',
      },
    ],
  },
  {
    categories: ['Perps', 'Gaming', 'Devnads'],
    containerClass: 'flex gap-6',
  },
  {
    categories: ['Betting', 'Prediction Market'],
    containerClass: 'flex gap-6',
  },
];

const MOBILE_CATEGORY_ORDER = [
  'NFT',
  'DeFi',
  'DEX',
  'Perps',
  'Gaming',
  'Prediction Market',
  'Betting',
  'Devnads',
];

export const ProjectsBubble = ({ onProjectClick }: ProjectsBubbleProps) => {
  const { allCategoriesWithProjects } = useProjectsContext();

  // Create a map for quick category lookup
  const categoryMap = new Map(
    allCategoriesWithProjects.map((category) => [category.categoryName, category])
  );

  return (
    <div className="pt-14 sm:pt-20" id="categories-section">
      <SectionHeader
        title="CATEGORIES"
        subtitle="Browse Categories"
        description="Discover projects across various categories in the Monad ecosystem."
      />

      {/* Desktop */}
      <div className="hidden lg:block space-y-6 mt-10">
        {CATEGORY_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className={group.containerClass}>
            {/* Render main category */}
            {group.categories.map((categoryName) => {
              const category = categoryMap.get(categoryName);
              if (!category || !CATEGORY_LAYOUTS[categoryName]) return null;

              return (
                <BubbleSection
                  key={category.categoryId}
                  categoryName={categoryName}
                  projects={category.projects}
                  layout={{
                    ...CATEGORY_LAYOUTS[categoryName],
                    width: group.wrapperClass || CATEGORY_LAYOUTS[categoryName].width,
                  }}
                  onProjectClick={onProjectClick}
                />
              );
            })}

            {/* Render nested sections */}
            {group.sections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className={section.containerClass}>
                {section.categories.map((categoryName) => {
                  const category = categoryMap.get(categoryName);
                  if (!category || !CATEGORY_LAYOUTS[categoryName]) return null;

                  return (
                    <BubbleSection
                      key={category.categoryId}
                      categoryName={categoryName}
                      projects={category.projects}
                      layout={CATEGORY_LAYOUTS[categoryName]}
                      onProjectClick={onProjectClick}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="lg:hidden space-y-6 mt-10">
        {MOBILE_CATEGORY_ORDER.map((categoryName) => {
          const category = categoryMap.get(categoryName);
          if (!category) return null;

          return (
            <BubbleSection
              key={category.categoryId}
              categoryName={categoryName}
              projects={category.projects}
              layout={{ width: 'w-full', gridCols: 'grid-cols-3' }}
              onProjectClick={onProjectClick}
            />
          );
        })}
      </div>
    </div>
  );
};
