// Types for Cover Letter Data

export type CoverLetterTone = "Formal" | "Neutral" | "Confident";

export interface CoverLetterData {
  recipientName: string;
  companyName: string;
  jobTitle: string;
  letterBody: string;
  tone: CoverLetterTone;
  date?: string; // ISO date string or formatted date
  // We might want to link it to personal info, or have it separate.
  // Given the requirement "Independent from resume form", we'll keep it self-contained for now,
  // but likely will need to access the user's personal info for the header.
  // For now, let's assume personal info comes from the same source or is also part of this form
  // if it's truly independent.
  // However, usually a cover letter matches the resume header.
  // I will add a sender info section similar to PersonalInfo but simpler, or rely on the CVContext if they are used together.
  // The requirement says "Link Logic bundled in one PDF", which implies they are related.
  // But "Independent from resume form" means the data input is separate.
  // I will add sender info here directly to be safe and truly independent.
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
}
