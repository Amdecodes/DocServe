import { CoverLetterData, PersonalInfo } from "@/types/cv";

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Ghost placeholder — faded italic text that signals "fill me in" */
function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-gray-300 italic border-b border-dashed border-gray-300">
      {children}
    </span>
  );
}

/**
 * Renders a value or, when in preview mode, a ghost placeholder.
 * In PDF mode (isPreview=false) empty fields are simply omitted.
 */
function Field({
  value,
  placeholder,
  isPreview,
}: {
  value: string | undefined;
  placeholder: string;
  isPreview: boolean;
}) {
  if (value) return <>{value}</>;
  if (isPreview) return <Placeholder>{placeholder}</Placeholder>;
  return null;
}

export function UnifiedCoverLetter({
  coverLetter,
  personalInfo,
  isPreview = false,
}: {
  coverLetter: CoverLetterData;
  personalInfo: PersonalInfo;
  isPreview?: boolean;
}) {
  if (!coverLetter || !personalInfo) return null;

  const rawName =
    `${personalInfo.firstName ?? ""} ${personalInfo.lastName ?? ""}`.trim();
  const senderName = rawName || (isPreview ? undefined : "");

  const hasCompany = !!coverLetter.companyName;
  const hasPosition = !!coverLetter.jobTitle;
  const hasBody = !!coverLetter.letterBody;

  return (
    <div className="p-12 max-w-[210mm] mx-auto text-gray-900 bg-white min-h-[297mm] font-serif leading-relaxed">
      {/* Header / Sender Info */}
      <div className="mb-8 border-b border-gray-300 pb-6">
        <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider">
          {senderName ?? <Placeholder>Your Name</Placeholder>}
        </h1>
        <div className="text-sm text-gray-600 flex flex-wrap gap-4">
          {personalInfo.email ? (
            <span>{personalInfo.email}</span>
          ) : isPreview ? (
            <Placeholder>email@example.com</Placeholder>
          ) : null}
          {personalInfo.phone ? (
            <span>• {personalInfo.phone}</span>
          ) : isPreview ? (
            <Placeholder>• +251 911 000 000</Placeholder>
          ) : null}
          {personalInfo.city ? (
            <span>
              • {personalInfo.city}
              {personalInfo.country ? `, ${personalInfo.country}` : ""}
            </span>
          ) : isPreview ? (
            <Placeholder>• Addis Ababa, Ethiopia</Placeholder>
          ) : null}
        </div>
      </div>

      {/* Date */}
      <div className="mb-8 text-right">
        <p>{formatDate()}</p>
      </div>

      {/* Recipient Info */}
      <div className="mb-8 space-y-1">
        {(hasCompany || isPreview) && (
          <p>
            <span className="font-bold">TO:</span>{" "}
            <Field
              value={coverLetter.companyName}
              placeholder="Company Name"
              isPreview={isPreview}
            />
          </p>
        )}
        {(hasPosition || isPreview) && (
          <p>
            <span className="font-bold">POSITION:</span>{" "}
            <Field
              value={coverLetter.jobTitle}
              placeholder="Job Title"
              isPreview={isPreview}
            />
          </p>
        )}
      </div>

      {/* Salutation */}
      <div className="mb-6">
        <p>
          Dear{" "}
          {coverLetter.recipientName
            ? coverLetter.recipientName
            : isPreview
              ? <Placeholder>Hiring Manager</Placeholder>
              : "Hiring Manager"}
          ,
        </p>
      </div>

      {/* Body */}
      <div className="mb-8 whitespace-pre-wrap text-justify">
        {hasBody ? (
          coverLetter.letterBody
        ) : isPreview ? (
          <Placeholder>
            [Your cover letter body will appear here. Fill in the Cover Letter
            step to see your content.]
          </Placeholder>
        ) : null}
      </div>

      {/* Sign-off */}
      <div className="mt-12">
        <p>Sincerely,</p>
        <br />
        <br />
        <p className="font-bold">
          {senderName ?? <Placeholder>Your Name</Placeholder>}
        </p>
      </div>
    </div>
  );
}
