'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ScrollToTop component provides a floating button that appears when user scrolls down
 * and allows them to quickly return to the Categories section.
 *
 * ### Features:
 * - **Auto Show/Hide**: Appears when user scrolls down, hides when at top
 * - **Smooth Animation**: Bounces on hover with smooth transitions
 * - **Purple Theme**: Matches the app's purple color scheme
 * - **Fixed Position**: Always visible in bottom-right corner
 * - **Accessibility**: Proper ARIA labels and keyboard support
 *
 * ### Styling:
 * - Circular button with purple gradient background
 * - Purple box shadow for depth
 * - Bounce animation on hover
 * - Smooth fade in/out transitions
 */

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToCategories = () => {
    const categoriesElement = document.getElementById('categories-section');
    if (categoriesElement) {
      categoriesElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <button
      onClick={scrollToCategories}
      className={cn(
        'fixed bottom-8 right-8 z-50',
        'w-12 h-12 rounded-full',
        'border border-purple-400/60',
        'shadow-lg shadow-purple-500/30',
        'flex items-center justify-center',
        'text-white/80',
        'transition-all duration-300 ease-in-out',
        'hover:shadow-xl hover:shadow-purple-500/40',
        'hover:scale-110 hover:-translate-y-1',
        'active:scale-95',
        'group',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      )}
      aria-label="Scroll to categories"
      title="Scroll to categories"
    >
      <ChevronUp
        className={cn(
          'w-6 h-6 transition-transform duration-200',
          'group-hover:animate-[bounce-gentle_0.6s_ease-in-out_infinite]'
        )}
      />
    </button>
  );
};
