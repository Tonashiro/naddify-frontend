import { NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables");
}

// GET: Fetch a project by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const response = await fetch(`${BASE_URL}/projects/${id}`, {
      method: "GET",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching project:", error);

    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a project by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const response = await fetch(`${BASE_URL}/projects/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error deleting project:", error);

    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

// PUT: Update a project by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await req.json();
    const response = await fetch(`${BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error updating project:", error);

    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
