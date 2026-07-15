# CV References Upon Request Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a "References available upon request" option in the CV form, enforce mutual exclusivity with manual references, and render it styled appropriately in all 14 resume templates.

**Architecture:** Add `referencesUponRequest?: boolean` to the CV data model. Update the References form component to render a checkbox with translations and implement mutual exclusivity logic. Update the live preview data pipeline and each of the 14 layout templates to display a styled placeholder text block when the flag is enabled.

**Tech Stack:** React, TypeScript, Next-Intl (for translations), Next.js.

## Global Constraints
- Keep standard styling consistent with each individual layout template.
- Implement mutual exclusivity: checking the box clears listed references and hides manual entry; adding references disables/hides the checkbox.

---

### Task 1: Data Model, Translations, Form UI & Live Preview Sync

**Files:**
- Modify: [types/cv.ts](file:///home/amde/DocServe/types/cv.ts:92-107)
- Modify: [messages/en.json](file:///home/amde/DocServe/messages/en.json:372-388)
- Modify: [messages/am.json](file:///home/amde/DocServe/messages/am.json:372-388)
- Modify: [components/cv/form/References.tsx](file:///home/amde/DocServe/components/cv/form/References.tsx:1-150)
- Modify: [components/cv/preview/CVPreview.tsx](file:///home/amde/DocServe/components/cv/preview/CVPreview.tsx:85-97)

**Interfaces:**
- Consumes: None (initial setup)
- Produces: `referencesUponRequest` boolean flag in `CVData`, checkbox UI in form, and preview state synchronization

- [ ] **Step 1: Check existing TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Command succeeds with no errors.

- [ ] **Step 2: Update `types/cv.ts`**
  Modify [types/cv.ts](file:///home/amde/DocServe/types/cv.ts) to add `referencesUponRequest?: boolean` to `CVData`.
  
  Replace:
  ```typescript
    references: ReferenceItem[];
    coverLetter?: CoverLetterData;
  ```
  With:
  ```typescript
    references: ReferenceItem[];
    referencesUponRequest?: boolean;
    coverLetter?: CoverLetterData;
  ```

- [ ] **Step 3: Update Translation Files**
  Modify [messages/en.json](file:///home/amde/DocServe/messages/en.json) to add `"uponRequest": "References available upon request"` under `References`.
  
  Replace:
  ```json
    "References": {
      "title": "References",
      "description": "Add people who can vouch for your professional work.",
  ```
  With:
  ```json
    "References": {
      "title": "References",
      "description": "Add people who can vouch for your professional work.",
      "uponRequest": "References available upon request",
  ```

  Modify [messages/am.json](file:///home/amde/DocServe/messages/am.json) to add `"uponRequest": "ማጣቀሻዎች ሲጠየቁ ይቀርባሉ"` under `References`.
  
  Replace:
  ```json
    "References": {
      "title": "ማጣቀሻዎች",
      "description": "ስለ ሙያዊ ስራዎ ምስክርነት ሊሰጡ የሚችሉ ሰዎችን ይጨምሩ።",
  ```
  With:
  ```json
    "References": {
      "title": "ማጣቀሻዎች",
      "description": "ስለ ሙያዊ ስራዎ ምስክርነት ሊሰጡ የሚችሉ ሰዎችን ይጨምሩ።",
      "uponRequest": "ማጣቀሻዎች ሲጠየቁ ይቀርባሉ",
  ```

- [ ] **Step 4: Update References form UI and enforce mutual exclusivity**
  Modify [components/cv/form/References.tsx](file:///home/amde/DocServe/components/cv/form/References.tsx) to add the checkbox.
  
  Replace:
  ```tsx
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{t("title")}</h2>
          <p className="text-sm text-gray-500">
            {t("description")}
          </p>
        </div>
  ```
  With:
  ```tsx
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{t("title")}</h2>
          <p className="text-sm text-gray-500">
            {t("description")}
          </p>
        </div>

        {/* References Upon Request Checkbox */}
        <div className="flex items-center space-x-2 pb-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <input
            type="checkbox"
            id="referencesUponRequest"
            checked={cvData.referencesUponRequest || false}
            disabled={(cvData.references || []).length > 0}
            onChange={(e) => {
              updateCVData("referencesUponRequest", e.target.checked);
              if (e.target.checked) {
                updateCVData("references", []);
              }
            }}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
          />
          <label htmlFor="referencesUponRequest" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            {t("uponRequest")}
          </label>
        </div>
  ```

  Also make the Add Reference button / UI conditional on the checkbox NOT being checked:
  
  Replace:
  ```tsx
        {isAdding ? (
  ```
  With:
  ```tsx
        {!cvData.referencesUponRequest && isAdding ? (
  ```

  And:
  ```tsx
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="w-full border-dashed py-8"
          >
            <Plus className="mr-2 h-4 w-4" /> {t("add")}
          </Button>
        )}
  ```
  With:
  ```tsx
        ) : !cvData.referencesUponRequest ? (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="w-full border-dashed py-8"
          >
            <Plus className="mr-2 h-4 w-4" /> {t("add")}
          </Button>
        ) : null}
  ```

- [ ] **Step 5: Synchronize preview fallback logic**
  Modify [components/cv/preview/CVPreview.tsx](file:///home/amde/DocServe/components/cv/preview/CVPreview.tsx) around lines 85-97 to prevent dummy references fallback if `referencesUponRequest` is checked.
  
  Replace:
  ```tsx
        references: deferredCvData.references?.length ? deferredCvData.references : CV_DUMMY_DATA.references,
  ```
  With:
  ```tsx
        references: (deferredCvData.references?.length || deferredCvData.referencesUponRequest)
          ? (deferredCvData.references || [])
          : CV_DUMMY_DATA.references,
        referencesUponRequest: deferredCvData.referencesUponRequest || false,
  ```

- [ ] **Step 6: Run verification checks**
  Run: `npx tsc --noEmit && npx eslint components/cv/form/References.tsx components/cv/preview/CVPreview.tsx`
  Expected: Command succeeds with 0 errors.

- [ ] **Step 7: Commit changes**
  Run:
  ```bash
  git add types/cv.ts messages/en.json messages/am.json components/cv/form/References.tsx components/cv/preview/CVPreview.tsx
  git commit -m "feat: implement referencesUponRequest model, form UI, and preview sync"
  ```

---

### Task 2: Layout Template Updates (Group A)

**Files:**
- Modify: [components/cv/preview/layouts/Classic.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/Classic.tsx)
- Modify: [components/cv/preview/layouts/CorporateFocus.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/CorporateFocus.tsx)
- Modify: [components/cv/preview/layouts/CreativeSplit.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/CreativeSplit.tsx)
- Modify: [components/cv/preview/layouts/Elegant.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/Elegant.tsx)
- Modify: [components/cv/preview/layouts/EmeraldProfessional.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/EmeraldProfessional.tsx)
- Modify: [components/cv/preview/layouts/ExecutiveMaroon.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/ExecutiveMaroon.tsx)
- Modify: [components/cv/preview/layouts/FreshmanEntry.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/FreshmanEntry.tsx)

**Interfaces:**
- Consumes: `referencesUponRequest` flag in `CVData`
- Produces: Correct rendering of placeholder statement in CV templates Group A

- [ ] **Step 1: Update layout `Classic.tsx`**
  Modify [components/cv/preview/layouts/Classic.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/Classic.tsx) to support `referencesUponRequest`.
  
  Replace:
  ```tsx
    const references = data.references || [];
  ```
  With:
  ```tsx
    const references = data.references || [];
    const referencesUponRequest = data.referencesUponRequest || false;
  ```

  And:
  ```tsx
        {/* References */}
        {references.length > 0 && (
          <section>
            <h3 className="font-bold text-gray-800 border-b border-gray-300 mb-3 uppercase text-sm tracking-wider">
              References
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {references.map((ref: any) => (
                <div key={ref.id} className="text-sm">
                  <div className="font-bold">{ref.name}</div>
                  <div className="text-gray-600">
                    {ref.position} {ref.company ? `at ${ref.company}` : ""}
                  </div>
                  {ref.phone && <div>Phone: {ref.phone}</div>}
                  {ref.email && <div>Email: {ref.email}</div>}
                </div>
              ))}
            </div>
          </section>
        )}
  ```
  With:
  ```tsx
        {/* References */}
        {(references.length > 0 || referencesUponRequest) && (
          <section>
            <h3 className="font-bold text-gray-800 border-b border-gray-300 mb-3 uppercase text-sm tracking-wider">
              References
            </h3>
            {referencesUponRequest ? (
              <p className="text-sm italic text-gray-600">References available upon request.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {references.map((ref: any) => (
                  <div key={ref.id} className="text-sm">
                    <div className="font-bold">{ref.name}</div>
                    <div className="text-gray-600">
                      {ref.position} {ref.company ? `at ${ref.company}` : ""}
                    </div>
                    {ref.phone && <div>Phone: {ref.phone}</div>}
                    {ref.email && <div>Email: {ref.email}</div>}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
  ```

- [ ] **Step 2: Update layouts `CorporateFocus.tsx`, `CreativeSplit.tsx`, `Elegant.tsx`, `EmeraldProfessional.tsx`, `ExecutiveMaroon.tsx`, `FreshmanEntry.tsx`**
  Modify each of these files to extract `referencesUponRequest` from data, check `(references.length > 0 || referencesUponRequest)` to display the section, and conditionally output `<p className="text-sm italic ...">References available upon request.</p>` if the flag is true.

- [ ] **Step 3: Run typescript verification**
  Run: `npx tsc --noEmit`
  Expected: Success.

- [ ] **Step 4: Commit changes**
  Run:
  ```bash
  git add components/cv/preview/layouts/Classic.tsx components/cv/preview/layouts/CorporateFocus.tsx components/cv/preview/layouts/CreativeSplit.tsx components/cv/preview/layouts/Elegant.tsx components/cv/preview/layouts/EmeraldProfessional.tsx components/cv/preview/layouts/ExecutiveMaroon.tsx components/cv/preview/layouts/FreshmanEntry.tsx
  git commit -m "feat: add referencesUponRequest layout support to Group A templates"
  ```

---

### Task 3: Layout Template Updates (Group B)

**Files:**
- Modify: [components/cv/preview/layouts/Golden.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/Golden.tsx)
- Modify: [components/cv/preview/layouts/LavenderExecutive.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/LavenderExecutive.tsx)
- Modify: [components/cv/preview/layouts/MinimalistTeal.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/MinimalistTeal.tsx)
- Modify: [components/cv/preview/layouts/Modern.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/Modern.tsx)
- Modify: [components/cv/preview/layouts/ModernDark.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/ModernDark.tsx)
- Modify: [components/cv/preview/layouts/ModernSidebar.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/ModernSidebar.tsx)
- Modify: [components/cv/preview/layouts/Professional.tsx](file:///home/amde/DocServe/components/cv/preview/layouts/Professional.tsx)

**Interfaces:**
- Consumes: `referencesUponRequest` flag in `CVData`
- Produces: Correct rendering of placeholder statement in CV templates Group B

- [ ] **Step 1: Update layouts `Golden.tsx`, `LavenderExecutive.tsx`, `MinimalistTeal.tsx`, `Modern.tsx`, `ModernDark.tsx`, `ModernSidebar.tsx`, `Professional.tsx`**
  Modify each of these files to extract `referencesUponRequest` from data, check `(references.length > 0 || referencesUponRequest)` to display the section, and conditionally output `<p className="text-sm italic ...">References available upon request.</p>` if the flag is true.

- [ ] **Step 2: Run verification checks**
  Run: `npx tsc --noEmit`
  Expected: Success.

- [ ] **Step 3: Commit changes**
  Run:
  ```bash
  git add components/cv/preview/layouts/Golden.tsx components/cv/preview/layouts/LavenderExecutive.tsx components/cv/preview/layouts/MinimalistTeal.tsx components/cv/preview/layouts/Modern.tsx components/cv/preview/layouts/ModernDark.tsx components/cv/preview/layouts/ModernSidebar.tsx components/cv/preview/layouts/Professional.tsx
  git commit -m "feat: add referencesUponRequest layout support to Group B templates"
  ```
