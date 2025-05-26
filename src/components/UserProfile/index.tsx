"use client";

import { BetaUserModal } from "@/components/BetaUserModal";
import { Skeleton } from "@/components/ui/skeleton";
import { BETA_CUTOFF_DATE } from "@/constants";
import { IUser, useUserContext } from "@/contexts/userContext";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export interface IUserProfile {
  user: IUser | null;
}

export const UserProfile: React.FC<IUserProfile> = () => {
  const { user, isLoading } = useUserContext();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) router.push("/");

  const isBetaUser =
    user?.created_at && new Date(user.created_at) < BETA_CUTOFF_DATE;

  return (
    <>
      <BetaUserModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <div className="flex gap-4">
        {isLoading || !user ? (
          <Skeleton className="w-24 h-24 rounded-full" />
        ) : (
          <Image
            src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`}
            alt="User Avatar"
            width={100}
            height={100}
            className="rounded-full pointer-events-none max-h-[100px] max-w-[100px]"
          />
        )}

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mt-4 capitalize">
            {user?.username}
          </h1>
          {isBetaUser && (
            <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold py-2 px-4 rounded-lg w-fit">
              BETA
            </button>
          )}
          <div
            className="flex items-center justify-center p-2 text-white gap-2 bg-purple-600 rounded-sm mt-4 cursor-pointer hover:bg-purple-700 hover:scale-[1.01] transition duration-300"
            onClick={() => setIsModalOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsModalOpen(true);
              }
            }}
            tabIndex={0}
            aria-pressed="false"
          >
            <Wallet />
            <span className="text-white pointer-events-none">
              {user?.wallet_address
                ? "Change your wallet"
                : "Submit your wallet"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
