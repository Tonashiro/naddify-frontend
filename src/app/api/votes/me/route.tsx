import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TVoteType } from "@/app/api/votes/[projectId]/route";

export type TProjectVote = {
  id: string;
  projectId: string;
  projectName: string;
  voteType: TVoteType;
  createdAt: string;
};

export interface IVotesStatsResponse {
  votes: TProjectVote;
  totalVotes: number;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/votes/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data: IVotesStatsResponse = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error voting:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
