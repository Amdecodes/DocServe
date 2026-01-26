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

/**
 * Uploads a temporary file (e.g., user upload for session, generated PDF)
 * These inputs go into the `temp/` folder and should be cleaned up periodically.
 */
export async function uploadTempFile(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ path: string; publicUrl: string; signedUrl?: string }> {
  const client = getSupabaseClientId();
  if (!client) throw new Error("Supabase client missing");

  // Force temp/ prefix if not present
  const filePath = fileName.startsWith("temp/") ? fileName : `temp/${fileName}`;

  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload temp failed: ${error.message}`);
  }

  // Create signed URL for access (24h)
  const { data: signed } = await client.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 24 * 60 * 60);

  return {
    path: data.path,
    publicUrl: signed?.signedUrl || "", // For temp files, we rely on signed URLs usually
    signedUrl: signed?.signedUrl,
  };
}

/**
 * Uploads a permanent product image.
 * Goes to `products/{id}/{originalName}`
 */
export async function uploadProductImage(
  fileBuffer: Buffer,
  productId: string,
  originalName: string,
  contentType: string
): Promise<{ path: string; publicUrl: string; signedUrl: string }> {
  const client = getSupabaseClientId();
  if (!client) throw new Error("Supabase client missing");

  const cleanName = originalName.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
  const filePath = `products/${productId}/${cleanName}`;

  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload product image failed: ${error.message}`);
  }

  // Create signed URL for secure access (valid for 1 year for product images)
  // Product images need long expiration since they're displayed on the site
  const expiresInSeconds = 365 * 24 * 60 * 60; // 1 year
  const { data: signedData, error: signError } = await client.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresInSeconds);

  if (signError || !signedData) {
    throw new Error(`Signed URL generation failed: ${signError?.message}`);
  }

  // Also get public URL format (for reference, though it won't work if bucket is private)
  const { data: publicUrlData } = client.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
    signedUrl: signedData.signedUrl,
  };
}

/**
 * Uploads a permanent template image.
 * Goes to `templates/{name}`
 */
export async function uploadTemplateImage(
  fileBuffer: Buffer,
  templateName: string,
  contentType: string
): Promise<{ path: string; publicUrl: string; signedUrl: string }> {
  const client = getSupabaseClientId();
  if (!client) throw new Error("Supabase client missing");

  const cleanName = templateName.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
  const extension = contentType.split("/")[1] || "png";
  const filePath = `templates/${cleanName}.${extension}`;

  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload template image failed: ${error.message}`);
  }

  // Create signed URL (1 year expiration for template images)
  const expiresInSeconds = 365 * 24 * 60 * 60;
  const { data: signedData, error: signError } = await client.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresInSeconds);

  if (signError || !signedData) {
    throw new Error(`Signed URL generation failed: ${signError?.message}`);
  }

  const { data: publicUrlData } = client.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
    signedUrl: signedData.signedUrl,
  };
}

// Retro-compatibility wrapper
export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
) {
  return uploadTempFile(fileBuffer, fileName, contentType);
}

export async function uploadPdf(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ path: string; signedUrl: string; expiresAt: Date }> {
  const client = getSupabaseClientId();
  if (!client) throw new Error("Supabase client missing");

  // Allow flexible paths. If it contains '/', use it as is. Otherwise default to temp/
  const filePath = fileName.includes("/") ? fileName : `temp/${fileName}`;

  console.log(`[Upload] Attempting to upload ${filePath} to bucket ${BUCKET_NAME}...`);
  const { data: uploadData, error: uploadError } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.error(`[Upload] Error for ${filePath}:`, uploadError);
    throw new Error(`Supabase upload failed: ${uploadError.message}`);
  }

  const expiresInSeconds = 24 * 60 * 60; // 24h
  const { data: signedData, error: signError } = await client.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresInSeconds, {
      download: "Document.pdf",
    });

  if (signError) {
    throw new Error(`Signed URL generation failed: ${signError.message}`);
  }

  return {
    path: uploadData.path,
    signedUrl: signedData.signedUrl,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
  };
}

export async function getSignedUrl(
  path: string,
  downloadName: string = "document.pdf",
  expiresInSeconds?: number
): Promise<{ signedUrl: string; expiresAt: Date } | null> {
  const client = getSupabaseClientId();
  if (!client) return null;

  // Default to 6 hours for PDFs, 1 year for images
  const defaultExpiration = downloadName.includes("image") || downloadName.endsWith(".jpg") || downloadName.endsWith(".png") || downloadName.endsWith(".webp")
    ? 365 * 24 * 60 * 60  // 1 year for images
    : 6 * 60 * 60;        // 6 hours for documents
  
  const expires = expiresInSeconds ?? defaultExpiration;
  
  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, expires, {
      download: downloadName,
    });

  if (error || !data) return null;

  return {
    signedUrl: data.signedUrl,
    expiresAt: new Date(Date.now() + expires * 1000),
  };
}

export async function deleteFile(path: string) {
  const client = getSupabaseClientId();
  if (!client) return;
  await client.storage.from(BUCKET_NAME).remove([path]);
}

/**
 * Deletes a file from storage given its full URL (signed or public)
 * Extracts the path from the URL and calls deleteFile
 */
export async function deleteFileFromUrl(url: string) {
  const client = getSupabaseClientId();
  if (!client) return;

  // Extract path from Supabase URL
  // Signed URLs: https://{project}.supabase.co/storage/v1/object/sign/{bucket}/{path}?token=...
  // Public URLs: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
  
  let path = "";
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Match pattern: /storage/v1/object/{sign|public}/{bucket}/{path}
    const match = pathname.match(/\/storage\/v1\/object\/(?:sign|public)\/[^/]+\/(.+)/);
    
    if (match && match[1]) {
      path = match[1];
    } else {
      console.warn(`[deleteFileFromUrl] Could not extract path from URL: ${url}`);
      return;
    }
  } catch (err) {
    console.error(`[deleteFileFromUrl] Invalid URL: ${url}`, err);
    return;
  }

  console.log(`[deleteFileFromUrl] Deleting file at path: ${path}`);
  await deleteFile(path);
}

/**
 * Lists files in a specific folder that are older than maxAgeMs
 */
export async function listOldFiles(folder: string, maxAgeMs: number) {
  const client = getSupabaseClientId();
  if (!client) return [];

  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .list(folder, {
      limit: 100, // Process in batches if needed
      sortBy: { column: "created_at", order: "asc" },
    });

  if (error || !data) {
    console.error("Error listing files:", error);
    return [];
  }

  const now = Date.now();
  // Filter for files older than maxAgeMs
  // Supabase returns 'created_at' as string ISO
  return data
    .filter((file) => {
      if (!file.created_at) return false;
      const created = new Date(file.created_at).getTime();
      return now - created > maxAgeMs;
    })
    .map((file) => `${folder}/${file.name}`); // Reconstruct full path
}
