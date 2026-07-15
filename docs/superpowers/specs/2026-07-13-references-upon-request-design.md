# Design Specification: CV References Upon Request

## Overview
Candidates often prefer not to list contact details for references directly on their resume for privacy reasons. Instead, they want a standard placeholder statement: "References available upon request."

This feature introduces a "References available upon request" checkbox in the CV form, enforces mutual exclusivity between custom references and this placeholder, and updates all 14 resume layout templates to natively display the placeholder using their respective typography and styles.

---

## 1. Architectural Changes

### A. Data Model
**File**: [types/cv.ts](file:///home/amde/DocServe/types/cv.ts)
*   Add `referencesUponRequest?: boolean;` to the `CVData` interface.

```typescript
export interface CVData {
  ...
  references: ReferenceItem[];
  referencesUponRequest?: boolean; // New optional property
  coverLetter?: CoverLetterData;
  ...
}
```

### B. Form Component
**File**: [components/cv/form/References.tsx](file:///home/amde/DocServe/components/cv/form/References.tsx)
*   Add a checkbox for "References available upon request" at the top of the form.
*   Implement mutual exclusivity:
    - If references already exist, hide/disable the checkbox.
    - If the checkbox is checked, clear references and hide the "Add Reference" UI.

### C. Live Preview Data Selector
**File**: [components/cv/preview/CVPreview.tsx](file:///home/amde/DocServe/components/cv/preview/CVPreview.tsx)
*   Prevent dummy/mock reference contacts from overriding an empty references array if `referencesUponRequest` is enabled.

```typescript
references: (deferredCvData.references?.length || deferredCvData.referencesUponRequest)
  ? (deferredCvData.references || [])
  : CV_DUMMY_DATA.references,
referencesUponRequest: deferredCvData.referencesUponRequest || false,
```

### D. Resume Layout Templates
**Directory**: `components/cv/preview/layouts/`
*   Modify all 14 resume templates (`Classic.tsx`, `CorporateFocus.tsx`, `CreativeSplit.tsx`, `Elegant.tsx`, `EmeraldProfessional.tsx`, `ExecutiveMaroon.tsx`, `FreshmanEntry.tsx`, `Golden.tsx`, `LavenderExecutive.tsx`, `MinimalistTeal.tsx`, `Modern.tsx`, `ModernDark.tsx`, `ModernSidebar.tsx`, `Professional.tsx`) to:
    - Conditionally render the references section if `references.length > 0 || referencesUponRequest` is true.
    - If `referencesUponRequest` is true, display a single styled line: *"References available upon request."* matching the template's font/color guidelines.
    - Else, render the standard references grid.

---

## 2. Test Plan
*   **Verification**:
    *   Verify that checking "References available upon request" disables/hides the manual reference inputs and clears any previously entered references.
    *   Verify that unchecking it restores the "Add Reference" button.
    *   Verify that each of the 14 layouts displays the placeholder correctly in the live preview.
    *   Verify that the generated PDF outputs the placeholder line correctly when printed.
