import { AGREEMENT_TEMPLATES } from "@/config/agreements";

// Clean, standard A4 HTML wrapper matching the reference format exactly
const HTML_SHELL = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 20mm 25mm 25mm 25mm;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Noto Sans Ethiopic', serif;
      font-size: 12pt;
      line-height: 1.8;
      color: #000;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .agreement-content {
      white-space: pre-wrap;
      word-wrap: break-word;
      tab-size: 4;
    }
    
    .variable {
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="agreement-content">${content}</div>
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

  // Sort variables to avoid partial replacements match issues (longer keys first)
  const sortedVars = [...template.variables].sort(
    (a, b) => b.key.length - a.key.length,
  );

  sortedVars.forEach((v) => {
    let val = formData[v.key];
    if (!val) val = "__________________"; // Fallback line if empty

    // Replace variables with bold spans (no underline - cleaner look)
    content = content
      .split(`{${v.key}}`)
      .join(`<span class="variable">${val}</span>`);
  });

  // Clean up any remaining conditional placeholders like {?...}{/?}
  content = content.replace(/\{\?[^}]*\}|\{\/\?\}/g, "");

  // The template content already has the correct structure and spacing
  // pre-wrap CSS will preserve all whitespace, tabs, and line breaks
  return HTML_SHELL(content);
}
