import { AGREEMENT_TEMPLATES } from "@/config/agreements";

/**
 * AGREEMENT RENDERER - "Digital Paper" System
 * ============================================
 *
 * This renderer transforms raw agreement templates into professional,
 * print-ready HTML documents. Key design principles:
 *
 * 1. FIXED A4 SHEET: 210mm × 297mm - what you see is what you print
 * 2. MAGNETIC ALIGNMENT: Date pins to right, Title pins to center
 * 3. SKELETON TABLES: Signature zones locked in columns
 * 4. VECTORIZED AMHARIC: Native print engine for sharp text
 * 5. AUTOMATIC CLEANING: Strips manual spaces, organizes structure
 */

const HTML_SHELL = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="am">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- High-quality Amharic font for vectorized rendering -->
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;600;700&display=swap" rel="stylesheet">
  
  <style>
    /* ============================================
       1. PAPER LAYOUT SETUP - "Digital Sheet"
       ============================================
       Creates a fixed A4 container (210mm × 297mm).
       The preview shows exactly what the printer produces.
    */
    @page {
      size: A4;
      margin: 0; /* Margins handled by .page for preview accuracy */
    }

    * { 
      box-sizing: border-box; 
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      background: #e0e0e0; /* Gray "desk" background for preview */
      margin: 0;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Noto Sans Ethiopic', 'Nyala', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
    }

    /* THE PHYSICAL SHEET - Fixed A4 dimensions */
    .page {
      background: white;
      width: 210mm;       /* A4 width - LOCKED */
      min-height: 297mm;  /* A4 height - LOCKED */
      padding: 20mm 25mm; /* Professional legal margins */
      margin: 0 auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* ============================================
       2. MAGNETIC ALIGNMENT - Header Elements
       ============================================
       Date "sticks" to right margin, Title "sticks" to center.
       No more manual spaces that break on font changes.
    */
    .header-section {
      margin-bottom: 25px;
    }

    .date-row {
      text-align: right;          /* MAGNETIC: pins to right margin */
      font-weight: 600;
      font-size: 11pt;
      margin-bottom: 20px;
      width: 100%;
    }

    .title {
      text-align: center;         /* MAGNETIC: pins to center */
      font-weight: 700;
      font-size: 14pt;
      text-decoration: underline;
      margin: 0 0 25px 0;
      padding: 0;
    }

    /* ============================================
       3. CONTENT BODY - Justified Text
       ============================================
       Both edges align perfectly like a government document.
       Automatic word spacing for professional appearance.
    */
    .content-body {
      text-align: justify;        /* Left AND right edges align */
      text-justify: inter-word;
      line-height: 1.9;
      font-size: 11pt;
      flex-grow: 1;
      hyphens: auto;
    }

    .content-body p {
      margin: 0 0 12px 0;
      text-indent: 0;
    }

    /* Party info blocks (Seller/Buyer) */
    .party-block {
      margin-bottom: 15px;
      padding-left: 10px;
      border-left: 2px solid #ddd;
    }

    .party-label {
      font-weight: 700;
      display: inline;
    }

    /* Variable placeholders - highlighted and underlined */
    .variable {
      font-weight: 700;
      border-bottom: 1.5px solid #000;
      padding: 0 4px;
      background: rgba(255, 255, 200, 0.3);
      display: inline;
      white-space: nowrap;
    }

    .variable-empty {
      display: inline-block;
      min-width: 100px;
      border-bottom: 1.5px dotted #999;
      color: #999;
    }

    /* ============================================
       4. SKELETON TABLE - Signature Zones
       ============================================
       Three locked columns that NEVER overlap:
       Zone 1: Seller | Zone 2: Buyer | Zone 3: Witnesses
    */
    .witness-section {
      margin-top: auto;           /* Push to bottom of page */
      padding-top: 20px;
      border-top: 1px solid #eee;
      page-break-inside: avoid;   /* Keep together when printing */
    }

    .witness-header {
      font-weight: 700;
      margin-bottom: 15px;
      font-size: 11pt;
    }

    .witness-list {
      margin: 0 0 25px 0;
      padding: 0;
      list-style: none;
    }

    .witness-list-item {
      display: flex;
      align-items: baseline;
      margin-bottom: 10px;
      gap: 10px;
    }

    .witness-list-item .number {
      font-weight: 600;
      min-width: 30px;
    }

    .witness-list-item .name-field {
      flex: 1;
      border-bottom: 1px solid #000;
      min-height: 20px;
      padding: 0 5px;
    }

    .witness-list-item .address-label {
      font-weight: 600;
      white-space: nowrap;
    }

    .witness-list-item .address-field {
      flex: 1;
      border-bottom: 1px solid #000;
      min-height: 20px;
      padding: 0 5px;
    }

    /* THE SKELETON: 3-column signature table */
    .sig-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 35px;
      table-layout: fixed;
    }

    .sig-table td {
      vertical-align: top;
      padding: 0 15px 0 0;
      width: 33.33%;
    }

    .sig-table td:first-child {
      padding-left: 0;
    }

    .sig-table td:last-child {
      padding-right: 0;
    }

    .sig-header {
      font-weight: 700;
      font-size: 10.5pt;
      margin-bottom: 20px;
      white-space: nowrap;
    }

    .sig-lines {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .sig-line {
      border-bottom: 1.5px solid #000;
      height: 20px;
    }

    /* Witness signatures special formatting */
    .witness-sigs {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .witness-sig-line {
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }

    .witness-sig-line .num {
      font-weight: 600;
      font-size: 10pt;
      line-height: 20px;
    }

    .witness-sig-line .line {
      flex: 1;
      border-bottom: 1.5px solid #000;
      height: 20px;
    }

    /* ============================================
       5. PRINT OPTIMIZATION
       ============================================
       Native print engine for vectorized Amharic.
       No image conversion = sharp text at any zoom.
    */
    @media print {
      body { 
        background: none !important; 
        padding: 0 !important;
        margin: 0 !important;
      }
      
      .page {
        margin: 0 !important;
        padding: 18mm 22mm !important; /* Slightly tighter for print */
        box-shadow: none !important;
        width: 100% !important;
        min-height: 100% !important;
      }

      .variable {
        background: none !important; /* Remove highlight for print */
      }

      /* Ensure no page breaks in critical areas */
      .witness-section,
      .sig-table {
        page-break-inside: avoid !important;
      }
    }

    /* ============================================
       6. RESPONSIVE PREVIEW
       ============================================
       Scale down for smaller screens while maintaining
       the A4 aspect ratio. Print remains unaffected.
    */
    @media screen and (max-width: 800px) {
      body {
        padding: 10px;
      }
      
      .page {
        width: 100%;
        min-height: auto;
        transform-origin: top center;
        transform: scale(0.9);
      }
    }
  </style>
</head>
<body>
  <div class="page">
    ${content}
  </div>
</body>
</html>
`;

export async function renderAgreementToHtml(
  formData: Record<string, string | number | boolean | null | undefined>,
  templateId: string,
): Promise<string> {
  const template = AGREEMENT_TEMPLATES.find((t) => t.id === templateId);
  if (!template) throw new Error("Template not found");

  let content = template.content;

  // ============================================
  // AUTOMATIC CLEANING - Smart Document Editor
  // ============================================
  // The renderer acts like an editor: strips manual spaces,
  // identifies structure, and rebuilds professionally.

  // 1. EXTRACT DATE VALUE (before cleaning removes it)
  const dateValue = formData["AGREEMENT_DATE"] || "................";

  // 2. CLEAN MANUAL SPACING AND STRUCTURE
  // Remove excessive spaces/tabs used for manual alignment
  content = content
    .replace(/[ \t]{3,}/g, " ") // Replace 3+ spaces with single space
    .replace(/^\s+/gm, "") // Remove leading whitespace from lines
    .replace(/\s+$/gm, "") // Remove trailing whitespace from lines
    .replace(/\n{3,}/g, "\n\n"); // Max 2 consecutive newlines

  // 3. REMOVE DATE LINE (we'll place it properly in header)
  content = content.replace(/.*ቀን\s*\{AGREEMENT_DATE\}.*/g, "");

  // 4. REMOVE TITLE LINE (we'll place it properly in header)
  content = content.replace(new RegExp(template.title, "g"), "");

  // 5. EXTRACT AND REMOVE WITNESS SECTION
  // Find where witness section starts and separate it
  const witnessMarkers = ["ይህንን ውል ስንዋዋል የነበሩ ምስክሮች", "የነበሩ ምስክሮች", "ምስክሮች"];

  let bodyText = content;
  let hasWitnessSection = false;

  for (const marker of witnessMarkers) {
    if (content.includes(marker)) {
      bodyText = content.split(marker)[0];
      hasWitnessSection = true;
      break;
    }
  }

  // 6. REMOVE OLD SIGNATURE LINES (underscores used for manual alignment)
  bodyText = bodyText
    .replace(/_{3,}/g, "") // Remove underscore lines
    .replace(/የሻጭ ስምና ፊርማ[\s\S]*/g, "") // Remove old signature text
    .replace(/የገዢ ስምና ፊርማ[\s\S]*/g, "") // Remove old signature text
    .replace(/የምስክሮች ፊርማ[\s\S]*/g, "") // Remove old signature text
    .replace(/\n{2,}$/g, "\n"); // Clean trailing newlines

  // 7. REPLACE ALL VARIABLES WITH STYLED SPANS
  template.variables.forEach((v) => {
    const rawVal = formData[v.key];
    let displayVal: string;

    if (rawVal === null || rawVal === undefined || rawVal === "") {
      displayVal = `<span class="variable-empty">...........................</span>`;
    } else if (typeof rawVal === "boolean") {
      // Handle checkbox variables with truthy/falsy values
      displayVal = `<span class="variable">${rawVal ? v.truthyValue || "✓" : v.falsyValue || "✗"}</span>`;
    } else {
      displayVal = `<span class="variable">${String(rawVal)}</span>`;
    }

    // Replace all occurrences of this variable
    bodyText = bodyText.split(`{${v.key}}`).join(displayVal);
  });

  // 8. HANDLE CONDITIONAL SECTIONS {?VAR=value}...{/?}
  bodyText = bodyText.replace(
    /\{\?(\w+)=(\w+)\}([\s\S]*?)\{\/\?\}/g,
    (match, varKey, expectedValue, innerContent) => {
      const actualValue = formData[varKey];
      if (
        String(actualValue) === expectedValue ||
        (actualValue === true && expectedValue === "በወኪል")
      ) {
        return innerContent;
      }
      return "";
    },
  );

  // 9. CONVERT BODY TEXT TO PARAGRAPHS
  const paragraphs = bodyText
    .split(/\n+/)
    .filter((p) => p.trim().length > 0)
    .map((p) => `<p>${p.trim()}</p>`)
    .join("\n");

  // 10. DETERMINE PARTY LABELS BASED ON AGREEMENT TYPE
  // Sales: ሻጭ (Seller) / ገዢ (Buyer)
  // Rentals: አከራይ (Landlord) / ተከራይ (Tenant)
  const isRental =
    template.title.includes("ኪራይ") || template.id.includes("rent");
  const party1Label = isRental ? "የአከራይ ስምና ፊርማ" : "የሻጭ ስምና ፊርማ";
  const party2Label = isRental ? "የተከራይ ስምና ፊርማ" : "የገዢ ስምና ፊርማ";

  // 11. BUILD THE FINAL HTML STRUCTURE
  const witnessNames = [
    {
      name: formData["WITNESS1_NAME"] || "",
      address: formData["WITNESS1_ADDRESS"] || "",
    },
    {
      name: formData["WITNESS2_NAME"] || "",
      address: formData["WITNESS2_ADDRESS"] || "",
    },
    {
      name: formData["WITNESS3_NAME"] || "",
      address: formData["WITNESS3_ADDRESS"] || "",
    },
  ];

  const witnessList = witnessNames
    .map(
      (w, i) => `
    <div class="witness-list-item">
      <span class="number">${["1ኛ", "2ኛ", "3ኛ"][i]}.</span>
      <span class="name-field">${w.name}</span>
      <span class="address-label">አድራሻ፡-</span>
      <span class="address-field">${w.address}</span>
    </div>
  `,
    )
    .join("");

  const finalHtml = `
    <!-- HEADER: Magnetically Aligned -->
    <div class="header-section">
      <div class="date-row">ቀን፡ <span class="variable">${dateValue}</span></div>
      <h1 class="title">${template.title}</h1>
    </div>
    
    <!-- BODY: Justified Text -->
    <div class="content-body">
      ${paragraphs}
    </div>

    <!-- FOOTER: Skeleton Table Structure -->
    ${
      hasWitnessSection
        ? `
    <div class="witness-section">
      <div class="witness-header">ይህንን ውል ስንዋዋል የነበሩ ምስክሮች፡-</div>
      
      <div class="witness-list">
        ${witnessList}
      </div>

      <!-- THE SKELETON: 3-Column Signature Table -->
      <table class="sig-table">
        <tr>
          <td>
            <div class="sig-header">${party1Label}</div>
            <div class="sig-lines">
              <div class="sig-line"></div>
              <div class="sig-line"></div>
            </div>
          </td>
          <td>
            <div class="sig-header">${party2Label}</div>
            <div class="sig-lines">
              <div class="sig-line"></div>
              <div class="sig-line"></div>
            </div>
          </td>
          <td>
            <div class="sig-header">የምስክሮች ፊርማ</div>
            <div class="witness-sigs">
              <div class="witness-sig-line">
                <span class="num">1.</span>
                <div class="line"></div>
              </div>
              <div class="witness-sig-line">
                <span class="num">2.</span>
                <div class="line"></div>
              </div>
              <div class="witness-sig-line">
                <span class="num">3.</span>
                <div class="line"></div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    `
        : ""
    }
  `;

  return HTML_SHELL(finalHtml, template.title);
}
