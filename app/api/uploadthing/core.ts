import { createRouteHandler } from "uploadthing/next";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for the app
export const ourFileRouter = {
  // Virtual assistance resume upload
  virtualAssistanceResume: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    "application/msword": { maxFileSize: "4MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Allow uploads without authentication for now
      // Can add auth checks here later if needed
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Virtual assistance resume uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Export route handlers
const handlers = createRouteHandler({
  router: ourFileRouter,
});

export const { GET, POST } = handlers;
