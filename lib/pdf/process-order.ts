import prisma from "@/lib/prisma";
import { DEFAULT_TEMPLATE } from "@/config/templates";
import { renderCvToHtml } from "@/lib/pdf/renderer";
import { renderAgreementToHtml } from "@/lib/pdf/agreement-renderer";
import { generatePdfFromHtml } from "@/lib/pdf/generator";
import { uploadPdf, deleteFileFromUrl } from "@/lib/upload";
import { CVData } from "@/types/cv";

export async function processOrderPdf(
  orderId: string,
  formData: any,
  serviceType: string = "cv_writing",
) {
  if (!formData) {
    console.warn(`[PDF Pipeline] Order ${orderId} has NO form_data. Skipping.`);
    return null;
  }

  try {
    console.log(
      `[PDF Pipeline] Starting processing for Order ${orderId}, Service: ${serviceType}`,
    );

    let html = "";

    // 1. Render based on service type
    if (serviceType.startsWith("agreement:")) {
      const templateId = serviceType.split(":")[1];
      // inject orderId for reference
      html = await renderAgreementToHtml({ ...formData, orderId }, templateId);
    } else {
      // Default to CV
      const cvData = formData as unknown as CVData & {
        selectedTemplate?: string;
      };
      const templateId = cvData.selectedTemplate || DEFAULT_TEMPLATE;
      console.log(`[PDF Pipeline] Using template: ${templateId} (from cvData.selectedTemplate: ${cvData.selectedTemplate})`);
      
      // Store original photo URL for cleanup
      const originalPhotoUrl = cvData.personalInfo?.photo;
      
      // Convert photo to base64 if present (fixes broken images in PDF)
      if (originalPhotoUrl) {
        const { imageUrlToBase64 } = await import("@/lib/pdf/image-utils");
        cvData.personalInfo.photo = await imageUrlToBase64(originalPhotoUrl);
        console.log(`[PDF Pipeline] Converted photo to base64 for PDF embedding`);
      }
      
      html = await renderCvToHtml(cvData as CVData, templateId);

      // 4. Cleanup Image (Privacy Rule: Delete user photo after PDF generation)
      // Now that image is embedded in PDF as base64, delete the source file to save storage
      if (originalPhotoUrl) {
        deleteFileFromUrl(originalPhotoUrl).catch((err) =>
          console.error("Photo cleanup failed", err),
        );
        console.log(`[PDF Pipeline] Deleted source image from storage: ${originalPhotoUrl}`);
      }
    }

    // 2. Generate
    const pdfBuffer = await generatePdfFromHtml(html);

    // 3. Upload (Fixed filename to allow overwriting/refreshing without duplicates)
    // Was: `orders/${orderId}/${Date.now()}-resume.pdf`
    const fileName = `orders/${orderId}/document.pdf`;
    const uploadResult = await uploadPdf(Buffer.from(pdfBuffer), fileName);

    console.log(`[PDF Pipeline] Completed. URL: ${uploadResult.signedUrl}`);

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
