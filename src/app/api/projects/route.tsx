// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";

export type TProjectStatus = "PENDING" | "TRUSTABLE" | "SCAM" | "RUG";

export interface IProject {
  id: string;
  name: string;
  description: string;
  website?: string | null;
  twitter?: string | null;
  discord?: string | null;
  github?: string | null;
  status: TProjectStatus;
  votes_for: number;
  votes_against: number;
  created_by: {
    username: string;
    avatar: string;
  } | null;
  categories: {
    id: string;
    name: string;
  }[];
  created_at: string;
}

export interface IPaginatedProjects {
  projects: IProject[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`);
    const queryParams = req.nextUrl.searchParams;

    queryParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    const res = await fetch(url.toString());

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const data: IPaginatedProjects = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching projects:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
