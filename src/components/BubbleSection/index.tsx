/**
 * @title BubbleSection Component
 * @notice A reusable component for displaying a grid of project items within a category
 *
 * @dev This component is used by ProjectsBubble to render individual category sections.
 * It handles the layout of project items in a grid format and includes:
 * - Category header
 * - Grid of project items with configurable columns
 * - Project avatar with hover effects
 * - Verification badge for verified projects
 *
 * The grid layout is controlled by the layout prop which specifies:
 * - width: Tailwind class for section width
 * - gridCols: Tailwind class for grid columns
 *
 * @param categoryName - Display name of the category
 * @param projects - Array of project objects to display
 * @param layout - Object containing width and grid column configuration
 * @param onProjectClick - Callback function when a project is clicked
 */

import { IProject } from '@/app/api/projects/route';
import { VerifiedIcon } from '../Icons/VerifiedIcon';
import { BubbleLayout } from '../ProjectsBubble';

interface BubbleSectionProps {
  categoryName: string;
  projects: IProject[];
  layout: BubbleLayout;
  onProjectClick: (projectName: string) => void;
}

export const BubbleSection = ({
  categoryName,
  projects,
  layout,
  onProjectClick,
}: BubbleSectionProps) => (
  <div className={`${layout.width} bg-gray-100/5 rounded-lg p-6 ${layout.height}`}>
    <h2 className="text-base font-bold text-white mb-4 text-center">{categoryName}</h2>
    <div className={`grid ${layout.gridCols} gap-6 place-items-center`}>
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onProjectClick(project.name)}
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
              <div className="absolute -top-1 right-0.5 z-10">
                <VerifiedIcon size={20} className="text-white" />
              </div>
            )}
          </div>
          <div className="text-center mt-2">
            <p className="text-[11px] text-gray-300 font-medium truncate group-hover:text-white transition-colors">
              {project.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
