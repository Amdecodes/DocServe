import { AGREEMENT_TEMPLATES } from "@/config/agreements";

// Professional A4 HTML wrapper optimized for PDF rendering
const HTML_SHELL = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    html, body {
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Noto Sans Ethiopic', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11pt;
      line-height: 1.7;
      color: #1a1a1a;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .agreement-container {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm 25mm 25mm 25mm;
      margin: 0 auto;
      background: white;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 24px;
      font-size: 16pt;
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 4px;
      color: #000;
      letter-spacing: 0.5px;
    }
    
    .variable {
      font-weight: 600;
      color: #000;
      background-color: #fef3c7;
      padding: 1px 4px;
      border-radius: 2px;
    }
    
    p {
      margin-bottom: 14px;
      text-align: justify;
      text-justify: inter-word;
      word-spacing: -0.5px;
      hyphens: auto;
      orphans: 3;
      widows: 3;
    }
    
    /* Section headers within content */
    p strong:first-child {
      display: block;
      margin-top: 18px;
      margin-bottom: 8px;
      font-size: 12pt;
    }
    
    /* Signature section styling */
    .signature-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      gap: 40px;
    }
    
    .signature-block {
      flex: 1;
    }
    
    .signature-line {
      border-bottom: 1px solid #333;
      height: 40px;
      margin-bottom: 8px;
    }
    
    .signature-label {
      font-size: 10pt;
      color: #555;
    }
    
    .footer {
      position: fixed;
      bottom: 15mm;
      left: 25mm;
      right: 25mm;
      border-top: 1px solid #e5e5e5;
      padding-top: 10px;
      font-size: 8pt;
      color: #888;
      display: flex;
      justify-content: space-between;
    }
    
    .footer-left {
      text-align: left;
    }
    
    .footer-right {
      text-align: right;
    }
    
    /* Page break handling */
    .page-break {
      page-break-before: always;
    }
    
    /* Lists if any */
    ul, ol {
      margin: 12px 0 12px 24px;
    }
    
    li {
      margin-bottom: 6px;
    }
  </style>
</head>
<body>
  <div class="agreement-container">
    ${content}
  </div>
</body>
</html>
`;

export async function renderAgreementToHtml(
  formData: Record<string, string | number | undefined>,
  templateId: string,
): Promise<string> {
  const template = AGREEMENT_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  let content = template.content;

  // Sort variables to avoid partial replacements match issues
  const sortedVars = [...template.variables].sort(
    (a, b) => b.key.length - a.key.length,
  );

  sortedVars.forEach((v) => {
    let val = formData[v.key];
    if (!val) val = "__________________"; // Fallback line if empty

    // Replace with bolded value spans
    content = content
      .split(`{${v.key}}`)
      .join(`<span class="variable">${val}</span>`);
  });

  // Convert newlines to paragraphs with proper formatting
  // Split by double newline for paragraphs
  const paragraphs = content.split("\n\n").filter(p => p.trim());
  
  // Generate current date for footer
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const htmlContent = `
    <h1>${template.title}</h1>
    ${paragraphs.map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("\n    ")}
    
    <div class="footer">
      <div class="footer-left">Document ID: ${formData.orderId || 'N/A'}</div>
      <div class="footer-right">Generated: ${currentDate} | SENEDX</div>
    </div>
  `;

  return HTML_SHELL(htmlContent, template.title);
}
