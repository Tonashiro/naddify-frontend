import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export type TVoteType = "FOR" | "AGAINST";

export interface IVote {
  id: string;
  user_id: string;
  project_id: string;
  vote_type: TVoteType;
  created_at: string;
}

export interface IVoteStats {
  votesFor: number;
  votesAgainst: number;
  total: number;
  score: number;
}

export interface IVoteResponse {
  message: string;
  vote: IVote;
  stats: IVoteStats;
}

export async function POST(req: NextRequest) {
  try {
    const { voteType, projectId }: { voteType: TVoteType; projectId: string } =
      await req.json();

    if (!voteType || !["FOR", "AGAINST"].includes(voteType)) {
      return NextResponse.json(
        { message: "Invalid vote type" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const discordToken = cookieStore.get("discord")?.value;

    if (!discordToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/votes/${projectId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${discordToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voteType }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data: IVoteResponse = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error voting:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
