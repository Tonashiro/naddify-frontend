import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const projectLogo = formData.get("projectLogo") as File;
    const projectBanner = formData.get("projectBanner") as File | null;

    if (!projectLogo) {
      return NextResponse.json(
        { message: "Logo is required" },
        { status: 400 }
      );
    }

    // Prepare FormData for both files
    const combinedFormData = new FormData();
    const logoBuffer = Buffer.from(await projectLogo.arrayBuffer());
    combinedFormData.append(
      "projectLogo",
      new Blob([logoBuffer]),
      `logo-${Date.now()}-${projectLogo.name}`
    );

    if (projectBanner) {
      const bannerBuffer = Buffer.from(await projectBanner.arrayBuffer());
      combinedFormData.append(
        "projectBanner",
        new Blob([bannerBuffer]),
        `banner-${Date.now()}-${projectBanner.name}`
      );
    }

    // Make a single request to upload both files
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: combinedFormData,
      }
    );

    if (!backendRes.ok) {
      const error = await backendRes.json();
      throw new Error(error.message ?? "Upload failed");
    }

    const { logoUrl, bannerUrl } = await backendRes.json();

    return NextResponse.json({ logoUrl, bannerUrl });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
