import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { IUser } from "@/contexts/userContext";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      
      return NextResponse.json(error, { status: res.status });
    }

    const data: IUser = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching user data:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
