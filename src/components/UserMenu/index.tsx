/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useUserContext } from "@/contexts/userContext";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";

export const UserMenu: React.FC = () => {
  const { user, connectDiscord, isLoading } = useUserContext();
  const router = useRouter();

  if (isLoading) {
    return <Skeleton className="w-10 h-10 rounded-full" />;
  }

  if (!user) {
    return (
      <Button
        onClick={connectDiscord}
        className="px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-all"
      >
        Connect Discord
      </Button>
    );
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        window.location.reload();
      } else {
        toast.error("Logout failed");
        console.error("Logout failed");
      }
    } catch (err) {
      toast.error("Logout failed");
      console.error("Logout error", err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <img
          src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`}
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto rounded-lg border border-gray-700 bg-gray-900 text-gray-100 shadow-lg p-1"
        sideOffset={8}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const el = document.getElementById("popover-focus-trap");
          el?.focus();
        }}
      >
        <div id="popover-focus-trap" tabIndex={-1} className="sr-only" />
        <Button
          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          onClick={() => router.push("/profile")}
        >
          Profile
        </Button>
        <Button
          className="w-full text-left px-4 py-2 mt-1 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
};
