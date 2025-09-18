/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';
import { useUserContext } from '@/contexts/userContext';
import { BetaUserModal } from '@/components/BetaUserModal';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

/**
 * A reusable navigation item component with hover effects.
 *
 * This component renders a navigation link inside a list item (`<li>`).
 * It supports both desktop and mobile variants with different styling:
 * - **Desktop variant**: Includes a hover effect where an underline smoothly expands from left to right
 * - **Mobile variant**: Includes a background hover effect with padding and rounded corners
 *
 * @param href - The URL the navigation item links to.
 * @param label - The text displayed for the navigation item.
 * @param onClick - Optional callback for mobile menu items to close the menu.
 * @param variant - The display variant: 'desktop' (default) or 'mobile'.
 *
 * @example
 * ```tsx
 * // Desktop navigation item
 * <NavItem href="/about" label="About" />
 *
 * // Mobile navigation item
 * <NavItem href="/about" label="About" variant="mobile" onClick={closeMenu} />
 * ```
 */
export const NavItem: React.FC<{
  href: string;
  label: string;
  onClick?: () => void;
  variant?: 'desktop' | 'mobile';
}> = ({ href, label, onClick, variant = 'desktop' }) => {
  const isMobile = variant === 'mobile';

  return (
    <li className={isMobile ? '' : 'relative group'}>
      <Link
        href={href}
        className={
          isMobile
            ? 'block py-3 px-4 text-lg text-gray-200 hover:text-purple-400 hover:bg-gray-800/50 transition-colors rounded-lg'
            : 'text-gray-200 hover:text-purple-400 transition-colors block py-2'
        }
        onClick={onClick}
      >
        {label}
      </Link>
      {!isMobile && (
        <span className="absolute left-0 bottom-[-3px] h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
      )}
    </li>
  );
};

/**
 * The `Navbar` component renders a fixed navigation bar at the top of the page.
 *
 * ### Features:
 * - **Logo**: Displays the project logo on the left, which navigates to the home page when clicked.
 * - **Navigation Links**: Includes links to different sections of the website (e.g., Projects, Team) in the center.
 * - **User Menu**: Displays a user menu or "Connect Discord" button on the right.
 * - **Mobile Menu**: Responsive dropdown menu for mobile devices using Shadcn Popover component.
 *
 * ### Styling:
 * - The navigation bar is styled using Tailwind CSS.
 * - It has a semi-transparent background with a blur effect (`backdrop-blur-md`) and a bottom border.
 * - The navigation bar is responsive, with navigation links hidden on smaller screens and shown in a dropdown.
 *
 * @example
 * ```tsx
 * <Navbar />
 * ```
 *
 * @returns A JSX element representing the navigation bar.
 */
export const Navbar: React.FC = () => {
  const { user } = useUserContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 flex items-center justify-between h-16">
        <div className="group flex items-center cursor-pointer hover:scale-110 transition-transform duration-300">
          <Link href="/">
            <img src="/images/naddify.webp" alt="Naddify Logo" width={50} height={50} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8 space-x-6">
          {user?.is_admin && <NavItem href="/projects/add" label="Add Project" />}
          <NavItem href="/" label="Home" />
          <NavItem href="/team" label="Team" />
        </ul>

        <div className="flex items-center gap-2">
          <UserMenu />
          {user?.id && user.can_vote && <BetaUserModal />}

          {/* Mobile Navigation */}
          <Popover open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <PopoverTrigger asChild>
              <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-800/50 transition-colors">
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-200" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-200" />
                )}
                <span className="sr-only">Toggle mobile menu</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 bg-gray-900/95 backdrop-blur-md border-gray-800 p-0 mt-2"
              align="end"
              sideOffset={8}
            >
              <nav className="p-2">
                <ul className="space-y-1">
                  {user?.is_admin && (
                    <NavItem
                      href="/projects/add"
                      label="Add Project"
                      onClick={closeMobileMenu}
                      variant="mobile"
                    />
                  )}
                  <NavItem href="/" label="Home" onClick={closeMobileMenu} variant="mobile" />
                  <NavItem href="/team" label="Team" onClick={closeMobileMenu} variant="mobile" />
                </ul>
              </nav>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};
