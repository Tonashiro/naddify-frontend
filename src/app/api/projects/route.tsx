import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import mockProjects from '../../../../mock_db/projects.json';

export type TProjectStatus = 'PENDING' | 'TRUSTABLE' | 'SCAM' | 'RUG';
export type TDiscordRoles = 'MON' | 'OG' | 'NAD' | 'FULL_ACCESS';

export type TVoteBreakdown = {
  role: TDiscordRoles;
  votes_for: number;
  votes_against: number;
};

export interface IProject {
  id: string;
  name: string;
  description: string;
  website?: string | null;
  twitter?: string | null;
  discord?: string | null;
  github?: string | null;
  logo_url: string;
  banner_url?: string | null;
  status: TProjectStatus;
  votes_for: number;
  votes_against: number;
  votes_breakdown?: Array<TVoteBreakdown>;
  nads_verified: boolean;
  nads_verified_at?: Date | null;
  created_by?: {
    username: string;
    avatar: string;
  } | null;
  categories: {
    id: string;
    name: string;
  }[];
  created_at?: string;
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
    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      const queryParams = req.nextUrl.searchParams;
      const page = parseInt(queryParams.get('page') || '1');
      const limit = parseInt(queryParams.get('limit') || '20');
      const category = queryParams.get('category');
      const onlyNew = queryParams.get('onlyNew') === 'true';

      let filteredProjects = mockProjects.projects as IProject[];
      if (category) {
        const categories = category.split(',');
        filteredProjects = filteredProjects.filter((project) =>
          project.categories.some((cat) => categories.includes(cat.id))
        );
      }

      if (onlyNew) {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredProjects = filteredProjects.filter(
          (project: IProject) => new Date(project.created_at!) > oneWeekAgo
        );
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

      return NextResponse.json({
        projects: paginatedProjects,
        pagination: {
          total: filteredProjects.length,
          page,
          limit,
          pages: Math.ceil(filteredProjects.length / limit),
        },
      });
    }

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
    console.error('Error fetching projects:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();

      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error creating project:', err);

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
