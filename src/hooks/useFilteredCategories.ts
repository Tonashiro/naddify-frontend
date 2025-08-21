import { useMemo } from 'react';

interface Category {
  id: string;
  name: string;
}

interface Project {
  id: string;
  categories?: Category[];
}

interface InitialProjects {
  projects: Project[];
}

/**
 * Custom hook that filters categories based on the categories used in projects.
 *
 * ### Purpose:
 * This hook extracts category IDs from a list of initial projects and filters
 * the full category list to only include categories that are actually used
 * by those projects. This is useful for displaying only relevant categories
 * in UI components like category filters or category displays.
 *
 * ### Features:
 * - **Category ID Extraction**: Iterates through all projects and collects unique category IDs.
 * - **Category Filtering**: Filters the full category list to only show categories that are used.
 * - **Memoization**: Uses React's `useMemo` to optimize performance by only recalculating
 *   when dependencies change.
 * - **Type Safety**: Provides TypeScript interfaces for proper type checking.
 *
 * ### Parameters:
 * - `categories`: Array of all available categories with `id` and `name` properties.
 * - `initialProjects`: Object containing an array of projects, each with optional categories.
 *
 * ### Returns:
 * - `initialUsedCategoryIds`: A Set containing the IDs of categories that are used in the initial projects.
 * - `filteredCategories`: An array of category objects that are actually used by the initial projects.
 *
 * ### Dependencies:
 * - Uses React's `useMemo` for performance optimization.
 *
 * ### Example:
 * ```tsx
 * const { initialUsedCategoryIds, filteredCategories } = useFilteredCategories(
 *   allCategories,
 *   { projects: initialProjectList }
 * );
 * ```
 *
 * @param categories - Array of all available categories.
 * @param initialProjects - Object containing projects with their associated categories.
 * @returns Object containing filtered categories and used category IDs.
 */
export const useFilteredCategories = (categories: Category[], initialProjects: InitialProjects) => {
  const initialUsedCategoryIds = useMemo(() => {
    const ids = new Set<string>();
    initialProjects.projects.forEach((project) => {
      project.categories?.forEach((category) => {
        ids.add(category.id);
      });
    });
    return ids;
  }, [initialProjects]);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => initialUsedCategoryIds.has(cat.id));
  }, [initialUsedCategoryIds, categories]);

  return {
    initialUsedCategoryIds,
    filteredCategories,
  };
};
