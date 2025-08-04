import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction, useRef, useState } from 'react';

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

  const allCategories = [{ id: 'all', name: 'All' }, ...categories];

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
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2"
      >
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors w-[160px]',
              category.name === 'Devnads'
                ? 'bg-amber-400 text-white font-medium shadow-[0_4px_8px_rgba(245,158,11,0.3),0_0_0_1px_rgba(245,158,11,0.35)]'
                : category.id === 'all'
                  ? selectedCategories.length === 0
                    ? 'bg-purple-600 text-white shadow-[0_4px_8px_rgba(168,85,247,0.2),0_0_0_1px_rgba(168,85,247,0.25)]'
                    : 'bg-gray-100/7 text-gray-300 hover:bg-gray-100/10 shadow-[0_4px_8px_rgba(168,85,247,0.2),0_0_0_1px_rgba(168,85,247,0.25)]'
                  : selectedCategories.includes(category.id)
                    ? 'bg-purple-600 text-white shadow-[0_4px_8px_rgba(168,85,247,0.2),0_0_0_1px_rgba(168,85,247,0.25)]'
                    : 'bg-gray-100/7 text-gray-300 hover:bg-gray-100/10 shadow-[0_4px_8px_rgba(168,85,247,0.2),0_0_0_1px_rgba(168,85,247,0.25)]',
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
};
