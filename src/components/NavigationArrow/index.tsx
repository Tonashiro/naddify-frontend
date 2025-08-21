import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * The `NavigationArrow` component displays a clickable navigation arrow for carousel navigation.
 *
 * ### Features:
 * - **Navigation Control**:
 *   - Provides clickable arrow buttons for horizontal scrolling navigation.
 *   - Supports both left and right navigation with customizable icons.
 * - **Positioning**:
 *   - Uses absolute positioning for overlay placement on carousel containers.
 *   - Automatically centers vertically with transform positioning.
 * - **Visual Design**:
 *   - Semi-transparent background with backdrop blur for better visibility.
 *   - Circular design with consistent sizing and hover effects.
 * - **Responsive Design**:
 *   - Styled using Tailwind CSS for consistent theming.
 *   - Proper z-index layering to appear above carousel content.
 *
 * ### Props:
 * - `onClick`: Function called when the arrow is clicked for navigation.
 * - `icon`: React element representing the arrow icon (e.g., ChevronLeft, ChevronRight).
 * - `className`: Optional additional CSS classes for custom positioning and styling.
 *
 * ### Dependencies:
 * - Uses the base `Button` component for accessibility and interaction handling.
 * - Uses `cn` utility for class name merging and conditional styling.
 *
 * ### Example:
 * ```tsx
 * <NavigationArrow
 *   onClick={() => scroll('left')}
 *   icon={<ChevronLeft className="w-5 h-5 text-white" />}
 *   className="left-0"
 * />
 * ```
 *
 * @param props - The props for the `NavigationArrow` component.
 * @returns A JSX element representing the navigation arrow button.
 */

export const NavigationArrow = ({
  onClick,
  icon,
  className,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
}) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'h-7 w-7 absolute top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 backdrop-blur-sm',
        className,
      )}
    >
      {icon}
    </Button>
  );
};
