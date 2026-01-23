import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;
const BUCKET_NAME = "generated-docs";

function getSupabaseClientId() {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
  }
  return null;
}

export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<{ path: string; publicUrl: string }> {
  const client = getSupabaseClientId();
  if (!client) throw new Error("Supabase client missing");

  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Use createSignedUrl with a long expiry for the session (24h)
  // or until PDF generation deletes it.
  // We need a URL accessible by Puppeteer.
  const { data: signed } = await client.storage
    .from(BUCKET_NAME)
    .createSignedUrl(fileName, 24 * 60 * 60);

  return {
    path: data.path,
    publicUrl: signed?.signedUrl || "",
  };
}

export async function uploadPdf(
  fileBuffer: Buffer,
  fileName: string,
): Promise<{ path: string; signedUrl: string; expiresAt: Date }> {
  const client = getSupabaseClientId();
  if (!client) {
    throw new Error(
      "Supabase client not initialized. Check your environment variables.",
    );
  }

  // 1. Upload to Supabase Storage
  console.log(
    `[Upload] Attempting to upload ${fileName} to bucket ${BUCKET_NAME}...`,
  );
  const { data: uploadData, error: uploadError } = await client.storage
    .from(BUCKET_NAME)
    .upload(fileName, fileBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.error(
      `[Upload] Supabase Upload Error for ${fileName}:`,
      uploadError,
    );
    throw new Error(`Supabase upload failed: ${uploadError.message}`);
  }

  console.log(`[Upload] Success: ${uploadData.path}`);

  // 2. Generate Signed URL (6 hours expiry)
  const expiresInSeconds = 6 * 60 * 60; // 6 hours
  const { data: signedData, error: signError } = await client.storage
    .from(BUCKET_NAME)
    .createSignedUrl(fileName, expiresInSeconds, {
      download: "Resume.pdf", // Force download with this filename
    });

  if (signError) {
    throw new Error(
      `Supabase signed URL generation failed: ${signError.message}`,
    );
  }

  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  return {
    path: uploadData.path,
    signedUrl: signedData.signedUrl,
    expiresAt,
  };
}

export async function getSignedUrl(
  path: string,
): Promise<{ signedUrl: string; expiresAt: Date } | null> {
  const client = getSupabaseClientId();
  if (!client) return null;

  const expiresInSeconds = 6 * 60 * 60; // 6 hours
  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, expiresInSeconds, {
      download: "Resume.pdf",
    });

  if (error || !data) {
    return null;
  }

  return {
    signedUrl: data.signedUrl,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
  };
}

export async function deleteFileFromUrl(url: string) {
  const client = getSupabaseClientId();
  if (!client) return;

  try {
    // Attempt compatibility with both standard Supabase URLs and potential custom domains if format matches
    // URL structure: .../storage/v1/object/public/[bucket]/[path]
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");

    // Look for 'public' or 'sign' to identify where bucket/path starts
    const typeIndex = pathParts.findIndex(
      (p) => p === "public" || p === "sign",
    );

    if (typeIndex !== -1 && typeIndex + 2 < pathParts.length) {
      const bucket = pathParts[typeIndex + 1];
      const path = pathParts.slice(typeIndex + 2).join("/");

      console.log(`[Cleanup] Deleting photo from bucket '${bucket}': ${path}`);
      const { error } = await client.storage.from(bucket).remove([path]);

      if (error) {
        console.error("[Cleanup] Failed to delete photo:", error);
      } else {
        console.log("[Cleanup] Photo deleted successfully.");
      }
    }
  } catch (e) {
    console.warn("[Cleanup] Could not attempt delete on URL:", url);
  }
}
