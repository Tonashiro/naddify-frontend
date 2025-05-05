import { cookies } from "next/headers";
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

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface IPaginatedProjects {
  projects: IProject[];
  pagination: IPagination;
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

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const discordToken = cookieStore.get("discord")?.value;

    if (!discordToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const mappedBody = {
      ...body,
      categories: [body.category],
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${discordToken}`,
        },
        body: JSON.stringify(mappedBody),
      }
    );

    if (!res.ok) {
      const error = await res.json();

      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error creating project:", err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
