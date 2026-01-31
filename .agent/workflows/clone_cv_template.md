---
description: Workflow for cloning a CV design from an image into a system-compatible template.
---

# Cloning a CV Template from Image

Follow these steps to convert a design image into a fully functional, PDF-ready CV template.

## 1. Analysis & Decomposition
- **Visuals**: Identify color palette (primary, secondary, accent), fonts (Serif vs Sans), and layout structure (Sidebar vs Full width).
- **Sections**: Map visual sections (Header, Experience, Skills) to the data model (`CVData`).
- **Dynamic Elements**: Identify lists that can grow (Experience, Skills) and need page-break handling.

## 2. Component Implementation
Create two components in `components/cv/preview/layouts/`:
1.  **Resume Component** (`NameLayout.tsx`):
    -   Use `min-h-[297mm]` (A4) for the main container to ensure full-page styling.
    -   Use **CSS Gradients** for background columns instead of absolute/fixed elements to ensure multi-page support.
    -   Styles: `background: linear-gradient(to right, [sidebar_color] [width]%, [main_color] [width]%)`.
2.  **Cover Letter Component** (`NameCoverLetter.tsx`):
    -   Replicate the Header and Sidebar design exactly.
    -   Ensure dynamic text areas expand correctly.

### Critical Rules
-   **Preview === PDF**: The PDF generator uses the *exact same component code*. Do not rely on browser-only CSS that `puppeteer` might miss (though widely supported now).
-   **Page Breaks**: Add `className="break-inside-avoid"` to list items (`<li>` or blocks) to prevent content chopping.
-   **Clickable Links**: Use standard `<a href="..." target="_blank">` tags.
-   **Empty States**: Handle missing data gracefully (don't show empty headers).

## 3. Registration
1.  Add entry to `config/templates.ts` in `TEMPLATES` array:
    -   Unique ID (e.g., `golden`).
    -   Dynamic imports for both Resume and Cover Letter.
2.  Add entry to `templateComponents` map for lazy loading.
3.  Add translations to `messages/en.json` under `Templates.${id}`.

## 4. Preview Integration
-   Update `components/cv/preview/CVPreview.tsx`:
    -   Add lazy imports for the new template (Resume & Cover Letter).
    -   Ensure the `CoverLetterComponent` is selected dynamically based on `selectedTemplate`.

## 5. Verification
-   **Live Preview**: Check infinite scrolling behavior.
-   **PDF Output**: Generate a PDF. Verify:
    -   **Multi-page**: Does the sidebar color continue to page 2? (Requires body-level background injection in `renderer.tsx` if relying on component styles isn't enough, but the gradient on container usually works if container scales).
    -   **Parity**: Does it look *exactly* like the preview?
