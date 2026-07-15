# CV Print Page Margins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add standard page margins to printed CVs (20mm top/bottom, 15mm left/right) and synchronize the live preview page break overlay to match.

**Architecture:** Configure margins globally using CSS `@page` in the print media stylesheet and configure Puppeteer to respect these page-size preferences. Adjust the live preview overlay to break every 257mm (297mm A4 height minus 40mm margins) to align with actual page splits.

**Tech Stack:** Next.js, Puppeteer, Tailwind CSS, TypeScript.

## Global Constraints
- Target standard A4 print dimensions.
- Ensure sidebars/header containers do not force blank pages by scaling to fit the printable area.

---

### Task 1: CSS and Puppeteer Page Margin Configuration

**Files:**
- Modify: [lib/pdf/renderer.tsx](file:///home/amde/DocServe/lib/pdf/renderer.tsx:113-147)
- Modify: [lib/pdf/generator.ts](file:///home/amde/DocServe/lib/pdf/generator.ts:47-56)

**Interfaces:**
- Consumes: None (initial setup)
- Produces: Global print page margins and updated Puppeteer parameters

- [ ] **Step 1: Check existing TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Command finishes successfully with no compilation errors.

- [ ] **Step 2: Update CSS `@page` margins and print overrides in `renderer.tsx`**
  Modify [lib/pdf/renderer.tsx](file:///home/amde/DocServe/lib/pdf/renderer.tsx) to replace the `@page` style with margins and print overrides.
  
  Replace:
  ```css
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; }
          .pdf-page-break { page-break-before: always; }
  ```
  With:
  ```css
          @page {
            size: A4;
            margin: 20mm 15mm;
          }
          body { -webkit-print-color-adjust: exact; }
          .pdf-page-break { page-break-before: always; }
          
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
            }
            /* Adjust template roots styled with min-h-[297mm] to fit within printable height */
            div[class*="min-h-[297mm]"], .min-h-\\[297mm\\] {
              min-height: 100% !important;
              height: auto !important;
            }
          }
  ```

- [ ] **Step 3: Configure Puppeteer to respect CSS page size in `generator.ts`**
  Modify [lib/pdf/generator.ts](file:///home/amde/DocServe/lib/pdf/generator.ts) to enable `preferCSSPageSize`.
  
  Replace:
  ```typescript
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      });
  ```
  With:
  ```typescript
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
      });
  ```

- [ ] **Step 4: Run typecheck and linting**
  Run: `npx tsc --noEmit && pnpm run lint`
  Expected: Command succeeds with no errors.

- [ ] **Step 5: Commit changes**
  Run:
  ```bash
  git add lib/pdf/renderer.tsx lib/pdf/generator.ts
  git commit -m "feat: configure print page margins and Puppeteer settings"
  ```

---

### Task 2: Live Preview Synchronization

**Files:**
- Modify: [components/cv/preview/CVPreview.tsx](file:///home/amde/DocServe/components/cv/preview/CVPreview.tsx:146-152)

**Interfaces:**
- Consumes: CSS page margin bounds (257mm printable height)
- Produces: Correctly positioned repeating visual page break line overlay

- [ ] **Step 1: Update visual page break overlay in `CVPreview.tsx`**
  Modify [components/cv/preview/CVPreview.tsx](file:///home/amde/DocServe/components/cv/preview/CVPreview.tsx) to repeat the page break line gradient every 257mm instead of 297mm.
  
  Replace:
  ```tsx
              {/* Visual Page Break Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-[40]"
                style={{
                  background: "repeating-linear-gradient(to bottom, transparent 0px, transparent calc(297mm - 1px), #e5e7eb calc(297mm - 1px), #e5e7eb 297mm)"
                }} 
              />
  ```
  With:
  ```tsx
              {/* Visual Page Break Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-[40]"
                style={{
                  background: "repeating-linear-gradient(to bottom, transparent 0px, transparent calc(257mm - 1px), #e5e7eb calc(257mm - 1px), #e5e7eb 257mm)"
                }} 
              />
  ```

- [ ] **Step 2: Run verification checks**
  Run: `npx tsc --noEmit && pnpm run lint`
  Expected: Success.

- [ ] **Step 3: Commit changes**
  Run:
  ```bash
  git add components/cv/preview/CVPreview.tsx
  git commit -m "feat: synchronize live preview page break overlay"
  ```
