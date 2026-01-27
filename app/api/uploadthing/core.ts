import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";
 
const f = createUploadthing();
 
async function isAdmin() {
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!user || !user.emailAddresses.some(e => e.emailAddress === adminEmail)) throw new Error("Unauthorized");
    return { userId: user.id };
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const user = await isAdmin();
 
      // If you throw, the user will not be able to upload
      // whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      return { uploadedBy: metadata.userId };
    }),

    pdfUploader: f({ pdf: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      return {}; 
    })
    .onUploadComplete(async ({ file }) => {
      console.log("PDF uploaded:", file.url);
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
