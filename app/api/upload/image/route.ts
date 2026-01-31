// Uploads user photo to Supabase
// Returns a temporary signed URL usable for preview and PDF generation

import { NextResponse } from "next/server";
import { uploadTempFile } from "@/lib/upload";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a temporary path: temp/session-id/timestamp-name
    // In a real auth app we'd use user ID, here we trust the random filename from client or gen one
    const safeName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
    const fileName = `temp/${Date.now()}-${safeName}`;

    const result = await uploadTempFile(buffer, fileName, file.type);

    return NextResponse.json({
      url: result.publicUrl,
      path: result.path,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
