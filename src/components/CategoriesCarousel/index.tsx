import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react';
import { NavigationArrow } from '../NavigationArrow';
import { Button } from '../ui/button';

interface ICategoryOption {
  id: string;
  name: string;
}

interface ICategoriesCarouselProps {
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  categories: ICategoryOption[];
  className?: string;
}

/**
 * The `CategoriesCarousel` component displays a scrollable row of category filters.
 *
 * ### Features:
 * - **Single-Row Layout**:
 *   - Categories displayed in a horizontal scrollable row
 *   - Maintains consistent spacing and alignment
 * - **Horizontal Scrolling**:
 *   - Smooth scrolling behavior with arrow navigation
 *   - Scrolls in groups of 5 items for better UX
 *   - Hidden scrollbar with maintained functionality
 * - **Category Selection**:
 *   - Single category selection with toggle functionality
 *   - "All" option to clear category filters
 *   - Visual feedback with purple highlight for selected category
 * - **Responsive Navigation**:
 *   - Arrow buttons appear/disappear based on scroll position
 *   - Semi-transparent backdrop for better visibility
 *
 * ### Props:
 * - `selectedCategories` (`string[]`): Currently selected category IDs
 * - `setSelectedCategories` (`Dispatch<SetStateAction<string[]>>`): State setter for category selection
 * - `categories` (`ICategoryOption[]`): Array of category objects with id and name
 * - `className` (`string`): Optional className for the container
 *
 * ### Example:
 * ```tsx
 * const categories = [
 *   { id: "1", name: "NFT" },
 *   { id: "2", name: "DeFi" }
 * ];
 *
 * <CategoriesCarousel
 *   selectedCategories={selectedCategories}
 *   setSelectedCategories={setSelectedCategories}
 *   categories={categories}
 * />
 * ```
 *
 * @param props - Component props
 * @returns A scrollable category filter carousel
 */
export const CategoriesCarousel: React.FC<ICategoriesCarouselProps> = ({
  selectedCategories,
  setSelectedCategories,
  categories,
  className,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const allCategories = useMemo(() => {
    const devnadsCategory = categories.find((cat) => cat.name === 'Devnads');
    const otherCategories = categories.filter((cat) => cat.name !== 'Devnads');

    return [
      { id: 'all', name: 'All' },
      ...(devnadsCategory ? [devnadsCategory] : []),
      ...otherCategories,
    ];
  }, [categories]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) => (prev.includes(categoryId) ? [] : [categoryId]));
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    // Calculate scroll amount based on button width + gap (approximately 160px + 8px)
    const itemWidth = 168;
    const scrollAmount = itemWidth * 3; // Scroll 3 items at a time
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={cn('relative w-full', className)}>
      {showLeftArrow && (
        <NavigationArrow
          onClick={() => scroll('left')}
          icon={<ChevronLeft className="w-5 h-5 text-white" />}
          className="left-0"
        />
      )}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2"
      >
        {allCategories.map((category) => (
          <Button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            category={
              category.id === 'all'
                ? selectedCategories.length === 0
                  ? 'selected'
                  : 'default'
                : selectedCategories.includes(category.id)
                  ? 'selected'
                  : category.name === 'Devnads'
                    ? 'Devnads'
                    : 'default'
            }
            className="px-4 py-2 rounded-full text-sm w-fit"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {showRightArrow && (
        <NavigationArrow
          onClick={() => scroll('right')}
          icon={<ChevronRight className="w-5 h-5 text-white" />}
          className="right-0"
        />
      )}
    </div>
  );
};
