import { NextResponse } from "next/server";

export interface IStats {
  uniqueVoters: number;
  totalVotes: number;
  totalProjects: number;
}

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stats`
    );

    if (!res.ok) {
      const error = await res.json();

      return NextResponse.json(error, { status: res.status });
    }

    const data: IStats = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error while retrieving stats:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
