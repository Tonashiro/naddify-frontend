"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/userContext";
import { Skeleton } from "@/components/ui/skeleton";

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
 * It includes:
 * - A logo on the left.
 * - Navigation links in the center.
 * - A "Connect Discord" button on the right.
 *
 * The navigation bar is responsive and uses Tailwind CSS for styling.
 *
 * @example
 * ```tsx
 * <Navbar />
 * ```
 */
export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, connectDiscord, isLoading } = useUserContext();

  let avatarSection;

  if (isLoading) {
    avatarSection = <Skeleton className="w-10 h-10 rounded-full" />;
  } else if (!user) {
    avatarSection = (
      <Button
        onClick={() => connectDiscord()}
        className="px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-all cursor-pointer"
      >
        Connect Discord
      </Button>
    );
  } else {
    avatarSection = (
      <div className="flex items-center cursor-pointer">
        <Image
          src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`}
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
          onClick={() => router.push("/profile")}
        />
      </div>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
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

        {/* Navigation Items */}
        <ul className="hidden md:flex items-center space-x-6">
          <NavItem href="/" label="Home" />
          <NavItem href="/scams" label="Scams" />
          <NavItem href="/about" label="About" />
        </ul>

        {avatarSection}
      </div>
    </nav>
  );
};
