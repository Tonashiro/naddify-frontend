"use client";

import { Spinner } from "@/components/Spinner";
import { useUserContext } from "@/contexts/userContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Profile() {
  const { user, isLoading } = useUserContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!user && !isLoading) router.push("/");

  useEffect(() => {
    const twitterConnected = searchParams.get("twitter_connect=true");

    if (twitterConnected) {
      router.replace("/profile");
    }
  }, [searchParams, router]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  const token = Cookies.get("token"); // already set after Discord login
  const twitterAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/twitter?state=${token}`;

  return (
    <div className="flex flex-col my-[5%]">
      <div className="flex gap-4">
        <Image
          src={`https://cdn.discordapp.com/avatars/${user?.discord_id}/${user?.avatar}.png`}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full cursor-pointer"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold mt-4 capitalize">
            {user?.username}
          </h1>
          <Link
            href={twitterAuthUrl}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 w-fit"
          >
            Connect Twitter
          </Link>
        </div>
      </div>
    </div>
  );
}
