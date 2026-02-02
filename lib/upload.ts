import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

/**
 * Uploads a file using UploadThing.
 * Maps to existing return structure for compatibility.
 */
export async function uploadTempFile(
  fileBuffer: Buffer,
  fileName: string, // Unused in UT mostly, unless we custom ID
  contentType: string
): Promise<{ path: string; publicUrl: string; signedUrl?: string }> {
  
  // Create a File object from buffer (UTApi expects File or Url)
  const file = new File([new Uint8Array(fileBuffer)], fileName, { type: contentType });

  const response = await utapi.uploadFiles(file);

  if (response.error) {
    throw new Error(`UploadThing error: ${response.error.message}`);
  }

  return {
    path: response.data.key, // Use key as path
    publicUrl: response.data.url,
    signedUrl: response.data.url, // UT urls are public usually
  };
}

export async function uploadProductImage(
  fileBuffer: Buffer,
  productId: string,
  originalName: string,
  contentType: string
): Promise<{ path: string; publicUrl: string; signedUrl: string }> {
  // Similar implementation
  return uploadTempFile(fileBuffer, originalName, contentType) as Promise<{ path: string; publicUrl: string; signedUrl: string }>;
}

export async function uploadTemplateImage(
  fileBuffer: Buffer,
  templateName: string,
  contentType: string
): Promise<{ path: string; publicUrl: string; signedUrl: string }> {
   return uploadTempFile(fileBuffer, templateName, contentType) as Promise<{ path: string; publicUrl: string; signedUrl: string }>;
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
  const file = new File([new Uint8Array(fileBuffer)], fileName, { type: "application/pdf" });

  const response = await utapi.uploadFiles(file);

  if (response.error) {
    throw new Error(`UploadThing error: ${response.error.message}`);
  }

  return {
    path: response.data.key,
    signedUrl: response.data.url,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Mock expiration
  };
}

export async function getSignedUrl(
  path: string, // This is the key
  downloadName: string = "document.pdf",
  expiresInSeconds?: number
): Promise<{ signedUrl: string; expiresAt: Date } | null> {
    // UploadThing URLs are generally public or signed for short term.
    // For now, return a public URL logic if we can, or just null if not supported.
    // But since we returned publicURL as signedUrl above, maybe we just constructs it.
    // https://utfs.io/f/KEY
    return {
        signedUrl: `https://utfs.io/f/${path}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
}

export async function deleteFile(path: string) {
  await utapi.deleteFiles(path);
}

export async function deleteFileFromUrl(url: string) {
    // Extract key from https://utfs.io/f/KEY or similar
    try {
        const urlObj = new URL(url);
        // pathname is usually /f/KEY
        const parts = urlObj.pathname.split("/");
        const key = parts[parts.length - 1];
        if (key) {
           console.log(`[deleteFileFromUrl] Deleting key: ${key}`);
           await utapi.deleteFiles(key);
        }
    } catch (e) {
        console.error("Error deleting file from url", e);
    }
}

export async function listOldFiles(folder: string, maxAgeMs: number) {
  // Not easily supported in UT without keeping track in DB.
  // Return empty for now.
  return [];
}
