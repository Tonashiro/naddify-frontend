"use client";

import { Spinner } from "@/components/Spinner";
import { BETA_CUTOFF_DATE } from "@/constants";
import { useUserContext } from "@/contexts/userContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, isLoading } = useUserContext();
  const router = useRouter();

  const isBetaUser =
    user?.created_at && new Date(user.created_at) < BETA_CUTOFF_DATE;

  if (!user && !isLoading) router.push("/");

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col my-[5%]">
      <div className="flex gap-4">
        <Image
          src={`https://cdn.discordapp.com/avatars/${user?.discord_id}/${user?.avatar}.png`}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full pointer-events-none"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold mt-4 capitalize">
            {user?.username}
          </h1>
          {isBetaUser && (
            <h2 className="text-lg font-semibold text-white">BETA USER</h2>
          )}
        </div>
      </div>
    </div>
  );
}
