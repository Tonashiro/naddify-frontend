import { IProject } from "@/app/api/projects/route";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const {
      project,
      projectId,
    }: { project: IProject & { category: string }; projectId: string } =
      await req.json();

    const mappedBody = {
      ...project,
      categories: [project.category],
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    console.error("Error updating project:", err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId }: { projectId: string } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { message: "Missing projectId" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
