import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { generatePdfFromHtml } from "@/lib/pdf/generator";
import { renderCvToHtml } from "@/lib/pdf/renderer";
import { CVData } from "@/types/cv";

// Type for the stored form data which includes CVData + selectedTemplate
interface StoredFormData extends CVData {
  selectedTemplate?: string;
}

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return new Response("Missing orderId", { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || order.status !== "PAID") {
    return new Response("Unauthorized", { status: 403 });
  }

  // 1. Get Data from DB
  const formData = order.form_data as unknown as StoredFormData;
  const cvData: CVData = formData;
  const templateId = formData.selectedTemplate || "modern"; // Fallback to modern

  // 2. Render to HTML (Using helper to avoid react-dom/server direct import issues)
  const html = await renderCvToHtml(cvData, templateId);

  // 3. Generate PDF
  try {
    const pdfBuffer = await generatePdfFromHtml(html);

    return new Response(pdfBuffer as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cv-${order.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation failed:", error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}
