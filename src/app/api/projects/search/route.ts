import { NextRequest, NextResponse } from 'next/server'
import mockProjects from '../../../../../mock_db/projects.json'
import { IProject } from '../route'

export async function GET(req: NextRequest) {
  try {
    const searchQuery = req.nextUrl.searchParams.get('q')?.toLowerCase()

    if (!searchQuery) {
      return NextResponse.json({ projects: [] })
    }

    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      const searchResults = (mockProjects.projects as IProject[]).filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery) ||
          project.description.toLowerCase().includes(searchQuery) ||
          project.categories.some((cat) =>
            cat.name.toLowerCase().includes(searchQuery),
          ),
      )

      return NextResponse.json({ projects: searchResults })
    }

    // Production: Forward to backend API
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/search`,
    )
    url.searchParams.set('q', searchQuery)

    const res = await fetch(url.toString())
    if (!res.ok) {
      const error = await res.json()
      return NextResponse.json(error, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error searching projects:', err)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
