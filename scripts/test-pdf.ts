import dotenv from "dotenv";
dotenv.config();

import { generatePdfFromHtml } from "../lib/pdf/generator";
import { uploadPdf } from "../lib/upload";
import fs from "fs";
import path from "path";

// Mock HTML for testing
const mockHtml = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: sans-serif; padding: 40px; }
      h1 { color: #0d9488; }
    </style>
  </head>
  <body>
    <h1>Test PDF Generation</h1>
    <p>If you can read this, Puppeteer is working correctly on this machine.</p>
    <p>This PDF was generated at: ${new Date().toISOString()}</p>
  </body>
</html>
`;

async function testPipeline() {
  console.log("Starting PDF Generation Test...");

  try {
    // Check credentials
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      console.warn("WARNING: Supabase credentials missing in environment!");
    } else {
      console.log("Supabase credentials found.");
    }

    // 1. Test PDF Generation
    console.log("1. Generating PDF with Puppeteer...");
    const pdfBuffer = await generatePdfFromHtml(mockHtml);
    console.log("PDF generated successfully. Size:", pdfBuffer.length, "bytes");

    // Save locally to verify
    const localPath = path.join(process.cwd(), "test-output.pdf");
    fs.writeFileSync(localPath, pdfBuffer);
    console.log(`Saved local copy to ${localPath}`);

    // 2. Test Supabase Upload
    console.log("2. Uploading to Supabase...");
    const fileName = `tests/test-${Date.now()}.pdf`;

    try {
      const result = await uploadPdf(Buffer.from(pdfBuffer), fileName);
      console.log("Upload successful!");
      console.log("URL:", result.signedUrl);
      console.log("Expires:", result.expiresAt);
    } catch (uploadErr) {
      console.error(
        "Upload failed. Verify your bucket 'generated-docs' exists and is private.",
      );
      console.error(uploadErr);
    }
  } catch (error) {
    console.error("Test Failed:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
  }
}

testPipeline();
