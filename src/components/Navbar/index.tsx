"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserMenu } from "@/components/UserMenu";

/**
 * A reusable navigation item component with hover effects.
 *
 * This component renders a navigation link inside a list item (`<li>`).
 * It includes a hover effect where an underline smoothly expands from left to right.
 *
 * @param href - The URL the navigation item links to.
 * @param label - The text displayed for the navigation item.
 *
 * @example
 * ```tsx
 * <NavItem href="/about" label="About" />
 * ```
 */
export const NavItem: React.FC<{ href: string; label: string }> = ({
  href,
  label,
}) => {
  return (
    <li className="relative group">
      <Link
        href={href}
        className="text-gray-200 hover:text-purple-400 transition-colors"
      >
        {label}
      </Link>
      <span className="absolute left-0 bottom-[-3px] h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
    </li>
  );
};

/**
 * The `Navbar` component renders a fixed navigation bar at the top of the page.
 *
 * ### Features:
 * - **Logo**: Displays the project logo on the left, which navigates to the home page when clicked.
 * - **Navigation Links**: Includes links to different sections of the website (e.g., Home, Scams) in the center.
 * - **User Menu**: Displays a user menu or "Connect Discord" button on the right.
 *
 * ### Styling:
 * - The navigation bar is styled using Tailwind CSS.
 * - It has a semi-transparent background with a blur effect (`backdrop-blur-md`) and a bottom border.
 * - The navigation bar is responsive, with navigation links hidden on smaller screens (`md:flex`).
 *
 * @example
 * ```tsx
 * <Navbar />
 * ```
 *
 * @returns A JSX element representing the navigation bar.
 */
export const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Image
            src="/images/monad-logo.svg"
            alt="Project Logo"
            width={150}
            height={150}
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>

        <ul className="hidden md:flex items-center space-x-6">
          <NavItem href="/" label="Home" />
          <NavItem href="/scams" label="Scams" />
        </ul>

        <UserMenu />
      </div>
    </nav>
  );
};
