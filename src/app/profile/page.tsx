"use client";

import { Spinner } from "@/components/Spinner";
import { useUserContext } from "@/contexts/userContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Profile() {
  const { user, isLoading } = useUserContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isTweeting, setIsTweeting] = useState(false);

  if (!user && !isLoading) router.push("/");

  useEffect(() => {
    const twitterConnected = searchParams.get("twitter_connect");

    if (twitterConnected) {
      router.replace("/profile");
    }
  }, [searchParams, router]);

  const token = Cookies.get("token");
  const twitterAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/twitter?state=${token}`;

  const postTweet = async () => {
    setIsTweeting(true);
    try {
      const res = await fetch("/api/twitter/post", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: "Hello from Nadsverify 👋" }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Tweet posted successfully!");
        console.log(result);
      } else {
        alert("Failed to post tweet: " + result.message);
        console.error(result);
      }
    } catch (err) {
      console.error("Unexpected error posting tweet:", err);
      alert("Unexpected error");
    } finally {
      setIsTweeting(false);
    }
  };

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
          className="rounded-full cursor-pointer"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold mt-4 capitalize">
            {user?.username}
          </h1>

          <Link
            href={twitterAuthUrl}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2 w-fit"
          >
            Connect Twitter
          </Link>

          <button
            onClick={postTweet}
            disabled={isTweeting}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2 w-fit disabled:opacity-50"
          >
            {isTweeting ? "Posting..." : "Tweet from my account"}
          </button>
        </div>
      </div>
    </div>
  );
}
