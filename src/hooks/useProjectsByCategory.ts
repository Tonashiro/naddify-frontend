import { useMemo } from 'react';
import { IProject } from '@/app/api/projects/route';

/**
 * Custom hook that provides utilities for grouping projects by their primary category.
 *
 * ### Purpose:
 * This hook provides functions to organize projects by their primary category,
 * making it easy to display projects grouped by category in UI components.
 *
 * ### Features:
 * - **Group by Category**: Groups all projects by their primary category
 * - **Get Projects by Category**: Returns projects for a specific category
 * - **Category Counts**: Provides count of projects per category
 * - **Memoization**: Uses React's `useMemo` for performance optimization
 *
 * ### Returns:
 * - `getProjectsByCategory`: Function that returns projects for a specific category
 * - `projectsByCategory`: Object with categories as keys and arrays of projects as values
 * - `categoryProjectCounts`: Object with category names and their project counts
 * - `allCategories`: Array of unique category names
 *
 * ### Example:
 * ```tsx
 * const { getProjectsByCategory, projectsByCategory } = useProjectsByCategory(projects);
 *
 * // Get projects for a specific category
 * const defiProjects = getProjectsByCategory('DeFi');
 *
 * // Display all categories with their projects
 * Object.entries(projectsByCategory).map(([category, projects]) => (
 *   <div key={category}>
 *     <h2>{category}</h2>
 *     {projects.map(project => <ProjectCard key={project.id} project={project} />)}
 *   </div>
 * ))
 * ```
 */

export const useProjectsByCategory = (projects: IProject[]) => {
  const projectsByCategory = useMemo(() => {
    const grouped: Record<string, IProject[]> = {};

    projects.forEach((project) => {
      const primaryCategory = project.categories?.[0]?.name || 'Uncategorized';

      if (!grouped[primaryCategory]) {
        grouped[primaryCategory] = [];
      }

      grouped[primaryCategory].push(project);
    });

    return grouped;
  }, [projects]);

  const categoryProjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    Object.entries(projectsByCategory).forEach(([category, projects]) => {
      counts[category] = projects.length;
    });

    return counts;
  }, [projectsByCategory]);

  const allCategories = useMemo(() => {
    return Object.keys(projectsByCategory);
  }, [projectsByCategory]);

  /**
   * Get projects for a specific category
   * @param categoryName - The name of the category to filter by
   * @returns Array of projects in the specified category
   */
  const getProjectsByCategory = (categoryName: string): IProject[] => {
    return projectsByCategory[categoryName] || [];
  };

  /**
   * Get categories sorted by project count (descending)
   * @returns Array of category names sorted by number of projects
   */
  const getCategoriesByProjectCount = (): string[] => {
    return Object.entries(categoryProjectCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category);
  };

  return {
    getProjectsByCategory,
    projectsByCategory,
    categoryProjectCounts,
    allCategories,
    getCategoriesByProjectCount,
  };
};
