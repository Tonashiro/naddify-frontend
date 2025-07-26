import { NextResponse } from 'next/server';

export interface ICategory {
  id: string;
  name: string;
  description?: string;
}

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/categories`);

    if (!res.ok) {
      const error = await res.json();

      return NextResponse.json(error, { status: res.status });
    }

    const data: ICategory[] = await res.json();

    // Dummy Devnads category to the frontend
    const devnadsCategory: ICategory = {
      id: 'devnads-temp-id',
      name: 'Devnads',
      description: 'Developer NADs Projects',
    };

    return NextResponse.json([...data, devnadsCategory]);
  } catch (err) {
    console.error('Error fetching categories data:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
