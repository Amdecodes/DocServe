import prisma from "@/lib/prisma";
import { renderCvToHtml } from "@/lib/pdf/renderer";
import { generatePdfFromHtml } from "@/lib/pdf/generator";
import { uploadPdf, deleteFileFromUrl } from "@/lib/upload";
import { CVData } from "@/types/cv";

export async function processOrderPdf(orderId: string, formData: any) {
  if (!formData) {
    console.warn(`[PDF Pipeline] Order ${orderId} has NO form_data. Skipping.`);
    return null;
  }

  try {
    console.log(`[PDF Pipeline] Starting processing for Order ${orderId}`);

    // 1. Cast and Render
    const cvData = formData as unknown as CVData & {
      selectedTemplate?: string;
    };
    const templateId = cvData.selectedTemplate || "modern";

    const html = await renderCvToHtml(cvData as CVData, templateId);

    // 2. Generate
    const pdfBuffer = await generatePdfFromHtml(html);

    // 3. Upload (Fixed filename to allow overwriting/refreshing without duplicates)
    // Was: `orders/${orderId}/${Date.now()}-resume.pdf`
    const fileName = `orders/${orderId}/cv.pdf`;
    const uploadResult = await uploadPdf(Buffer.from(pdfBuffer), fileName);

    console.log(`[PDF Pipeline] Completed. URL: ${uploadResult.signedUrl}`);

    // 4. Cleanup Image (Privacy Rule: Delete user photo after PDF generation)
    if (cvData.personalInfo?.photo) {
      // We assume the photo URL is from our storage and delete it to save space/privacy
      // Non-blocking catch to ensure PDF result is returned even if deletion hiccups
      deleteFileFromUrl(cvData.personalInfo.photo).catch((err) =>
        console.error("Photo cleanup failed", err),
      );
    }

    return {
      pdfUrl: uploadResult.signedUrl,
      expiresAt: uploadResult.expiresAt,
    };
  } catch (error) {
    console.error(`[PDF Pipeline] Failed for Order ${orderId}:`, error);
    // Don't throw, return null so we can treat as partial success if needed
    // or arguably we should throw to ensure the caller knows it failed.
    // Let's rethrow to handle appropriately in caller.
    throw error;
  }
}
