import { AGREEMENT_TEMPLATES } from "@/config/agreements";

// Basic HTML wrapper with Tailwind CDN for simple styling or inline styles
const HTML_SHELL = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Noto Sans Ethiopic', 'Inter', sans-serif;
      padding: 40px 60px;
      line-height: 1.8;
      color: #111;
    }
    .agreement-container {
      max-width: 100%;
      margin: 0 auto;
      text-align: justify;
    }
    h1 {
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
      text-decoration: underline;
    }
    .variable {
      font-weight: bold;
      /* text-decoration: underline; */
    }
    p {
      margin-bottom: 12px;
    }
    .footer {
      margin-top: 50px;
      border-top: 1px solid #ccc;
      padding-top: 10px;
      font-size: 10px;
      color: #666;
      display: flex;
      justify-content: space-between;
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

  // Convert newlines to paragraphs
  // 1. Split by double newline for paragraphs
  const paragraphs = content.split("\n\n");
  const htmlContent = `
    <h1>${template.title}</h1>
    ${paragraphs.map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("")}
    <div style="page-break-before: always;"></div>
    <div class="footer">
       <span>Agreement Version: ${template.version}</span>
       <span>Ref: ${formData.orderId || "N/A"}</span>
       <span>Generated: ${new Date().toLocaleDateString()}</span>
    </div>
  `;

  return HTML_SHELL(htmlContent, template.title);
}
