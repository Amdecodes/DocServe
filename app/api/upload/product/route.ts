
import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/upload";
import { currentUser } from "@clerk/nextjs/server";

// Helper to enforce admin auth
async function requireAdmin() {
  const user = await currentUser();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!user || !adminEmail) {
    throw new Error("Unauthorized");
  }

  const isEmailMatch = user.emailAddresses.some(
    (e) => e.emailAddress.toLowerCase() === adminEmail.toLowerCase()
  );

  if (!isEmailMatch) {
    throw new Error("Unauthorized");
  }
}

export async function POST(req: Request) {
  try {
    // Restrict access to admin
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;

    if (!file || !productId) {
      return NextResponse.json(
        { error: "File and productId are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // We trust admin provided file.name or we can sanitize it
    // The lib function cleans it anyway.
    const result = await uploadProductImage(
      buffer,
      productId,
      file.name,
      file.type
    );

    return NextResponse.json({
      url: result.signedUrl, // Use signed URL for private bucket access
      path: result.path,
    });
  } catch (error) {
    console.error("Product upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
