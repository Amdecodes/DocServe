import { CoverLetterData, PersonalInfo } from "@/types/cv";

export function ModernCoverLetter({
  coverLetter,
  personalInfo,
}: {
  coverLetter: CoverLetterData;
  personalInfo: PersonalInfo;
}) {
  if (!coverLetter || !personalInfo) return null;
  const senderName =
    `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Your Name";
  return (
    <div className="h-full w-full p-10 font-sans text-gray-800">
      {/* Header */}
      <header className="border-b-4 border-teal-600 pb-6 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold uppercase tracking-tight text-gray-900 leading-none">
            {senderName}
          </h1>
          <p className="text-2xl mt-2 text-gray-600 font-light">
            {personalInfo.jobTitle || "Job Title"}
          </p>
        </div>
        <div className="text-right text-sm text-gray-500 space-y-1 self-center">
          <p>{personalInfo.email || "email@example.com"}</p>
          <p>{personalInfo.phone || "+251 900 000 000"}</p>
          <p>
            {personalInfo.city && personalInfo.country
              ? `${personalInfo.city}, ${personalInfo.country}`
              : "Addis Ababa, Ethiopia"}
          </p>
        </div>
      </header>
      {/* Recipient Info */}
      <div className="mb-8">
        <p className="font-bold">
          {coverLetter.recipientName || "Recipient Name"}
        </p>
        <p>{coverLetter.jobTitle && `${coverLetter.jobTitle}`}</p>
        <p>{coverLetter.companyName || "Company Name"}</p>
      </div>
      {/* Salutation */}
      <div className="mb-6">
        <p>Dear {coverLetter.recipientName || "Hiring Manager"},</p>
      </div>
      {/* Body */}
      <div className="mb-8 whitespace-pre-wrap text-justify">
        {coverLetter.letterBody || (
          <span className="text-gray-400 italic">
            [Your cover letter body will appear here. Fill in the Cover Letter
            step to see your content.]
          </span>
        )}
      </div>
      {/* Sign-off */}
      <div className="mt-12">
        <p>Sincerely,</p>
        <br />
        <br />
        <p className="font-bold">{senderName}</p>
      </div>
    </div>
  );
}
