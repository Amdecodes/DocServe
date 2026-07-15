import { NextResponse } from "next/server";
import { getSignedUrl } from "@/lib/upload";

/**
 * Converts a public URL or path to a fresh signed URL
 * Used to fix old product images that were uploaded with public URLs
 */
export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Extract path from URL
    let path = url;
    
    // If it's a full URL, extract the path
    if (url.startsWith("http")) {
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        
        // Match pattern: /storage/v1/object/{public|sign}/{bucket}/{path}
        const match = pathname.match(/\/storage\/v1\/object\/(?:sign|public)\/[^/]+\/(.+)/);
        
        if (match && match[1]) {
          path = match[1];
        } else {
          return NextResponse.json(
            { error: "Could not extract path from URL" },
            { status: 400 }
          );
        }
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 }
        );
      }
    }

    // Generate new signed URL (1 year expiration for product images)
    const result = await getSignedUrl(path, "image");

    if (!result) {
      return NextResponse.json(
        { error: "Failed to generate signed URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      signedUrl: result.signedUrl,
      expiresAt: result.expiresAt,
      path,
    });
  } catch (error) {
    console.error("Refresh URL error:", error);
    return NextResponse.json({ error: "Failed to refresh URL" }, { status: 500 });
  }
}
