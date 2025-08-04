import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * The `ProjectCardSkeleton` component is a skeleton loading state for the `ProjectCard` component.
 *
 * ### Features:
 * - **Skeleton Loading**:
 *   - Displays a placeholder for the project card while the data is loading.
 *   - Uses a card-like structure with a gap of 4 units between elements.
 *   - Uses a gray background color with 70% opacity.
 *
 * ### Styling:
 * - Uses Tailwind CSS for styling.
 * - Includes a card-like structure with a gap of 4 units between elements.
 * - Uses a gray background color with 70% opacity.
 *
 * ### Example:
 * ```tsx
 * import { ProjectCardSkeleton } from '@/components/ProjectCardSkeleton'
 *
 * <ProjectCardSkeleton />
 * ```
 *
 * @returns A JSX element representing the skeleton loading state for the project card.
 */

export const ProjectCardSkeleton = () => {
  return (
    <Card className="flex flex-col gap-4 p-4 bg-gray-100/7">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>

      {/* Image */}
      <Skeleton className="w-full h-[200px] rounded-lg" />

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Categories */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </Card>
  );
};
