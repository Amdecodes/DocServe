# Design Specification: CV Print Page Margins

## Overview
Currently, the CV rendering pipeline produces PDFs with zero page margins. This causes printed page content to stretch to the absolute edges of the paper. On multi-page resumes, text on subsequent pages touches the very top and bottom margins, violating standard professional CV layout guidelines.

This design introduces standard page margins (20mm top/bottom, 15mm left/right) in print mode and synchronizes the frontend live preview so that the visual page break lines accurately reflect where the PDF engine will break the pages.

---

## 1. Architectural Changes

### A. Print Stylesheet
**File**: [lib/pdf/renderer.tsx](file:///home/amde/DocServe/lib/pdf/renderer.tsx)
*   Update the `@page` directive to set standard dimensions and margins.
*   Add print media overrides to handle background heights and prevent empty pages from overflow.

```css
@page {
  size: A4;
  margin: 20mm 15mm;
}

@media print {
  body {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Prevent full-bleed heights from forcing extra empty pages */
  div[class*="min-h-[297mm]"], .min-h-\\[297mm\\] {
    min-height: 100% !important;
    height: auto !important;
  }
}
```

### B. PDF Generation Engine
**File**: [lib/pdf/generator.ts](file:///home/amde/DocServe/lib/pdf/generator.ts)
*   Configure Puppeteer to use the page size and margins defined in the CSS stylesheet instead of using custom overrides.

```typescript
const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true, // Uses @page margins defined in the CSS
});
```

### C. Live Preview Synchronization
**File**: [components/cv/preview/CVPreview.tsx](file:///home/amde/DocServe/components/cv/preview/CVPreview.tsx)
*   Adjust the page break calculation overlay from `297mm` to `257mm` (A4 height minus the total top and bottom margins: `297mm - 40mm = 257mm`). This ensures the live editor preview matches the exported PDF.

```tsx
{/* Visual Page Break Overlay */}
<div 
  className="absolute inset-0 pointer-events-none z-[40]"
  style={{
    background: "repeating-linear-gradient(to bottom, transparent 0px, transparent calc(257mm - 1px), #e5e7eb calc(257mm - 1px), #e5e7eb 257mm)"
  }} 
/>
```

---

## 2. Test Plan
*   **Verification**:
    *   Verify that generated PDF has consistent white borders of 20mm top/bottom and 15mm left/right.
    *   Verify that sidebar layouts (like `CreativeSplit` and `CorporateFocus`) stop cleanly at the margins.
    *   Verify that the preview's visual page break lines perfectly align with actual PDF page splits.
