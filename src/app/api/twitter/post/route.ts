import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: no token" },
        { status: 401 }
      );
    }

    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { message: "Invalid tweet content" },
        { status: 400 }
      );
    }

    const tokenRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/twitter/tokens`,
      {
        method: "GET",
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Token fetch failed:", err);
      return NextResponse.json(
        { message: "Could not get Twitter token" },
        { status: 500 }
      );
    }

    const { access_token } = await tokenRes.json();

    const twitterRes = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!twitterRes.ok) {
      const err = await twitterRes.text();
      console.error("Twitter post failed:", err);
      return NextResponse.json(
        { message: "Failed to post tweet" },
        { status: 500 }
      );
    }

    const tweetData = await twitterRes.json();
    return NextResponse.json({ success: true, tweet: tweetData });
  } catch (err) {
    console.error("Twitter post error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
