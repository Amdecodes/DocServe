
import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/upload";

export async function POST(req: Request) {
  try {
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
