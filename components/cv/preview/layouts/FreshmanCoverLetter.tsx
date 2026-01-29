import { CoverLetterData, PersonalInfo } from "@/types/cv";

export function FreshmanCoverLetter({
  coverLetter,
  personalInfo,
}: {
  coverLetter: CoverLetterData;
  personalInfo: PersonalInfo;
}) {
  if (!coverLetter || !personalInfo) return null;
  const senderName =
    `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Your Name";

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div 
      className="min-h-[297mm] h-full w-full font-sans text-slate-700 bg-white flex flex-col pt-4"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* Top Banner Accent */}
      <div className="h-4 w-full bg-[#fef2f2] mb-8 shrink-0"></div>

      <div className="px-12 flex-1 flex flex-col pb-20">
        {/* Header - Sender Info */}
        <header className="mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tight text-[#fb7185] leading-none mb-4">
            {senderName}
          </h1>
          <div className="h-1 w-32 bg-[#fb7185]/20 mb-6"></div>
          
          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>• {personalInfo.phone}</p>}
            {personalInfo.city && (
              <p>
                • {personalInfo.city}
                {personalInfo.country ? `, ${personalInfo.country}` : ""}
              </p>
            )}
          </div>
        </header>

        <div className="flex-1 max-w-2xl">
          {/* Internal Logistics */}
          <div className="mb-10 flex justify-between items-baseline">
            <div className="text-sm font-bold text-[#fb7185] uppercase tracking-wider">
              {formatDate()}
            </div>
          </div>

          {/* Recipient Info */}
          <div className="mb-10 space-y-1">
            <p className="text-sm font-black text-slate-900 uppercase tracking-wider">To:</p>
            <p className="font-bold text-slate-800">
              {coverLetter.recipientName || "Recipient Name"}
            </p>
            <p className="text-sm text-slate-600">{coverLetter.jobTitle || "Job Position"}</p>
            <p className="text-sm text-slate-600 font-bold">{coverLetter.companyName || "Company Name"}</p>
          </div>

          {/* Salutation */}
          <div className="mb-6">
            <p className="font-bold text-slate-800">Dear {coverLetter.recipientName || "Hiring Manager"},</p>
          </div>

          {/* Body */}
          <div className="mb-12 whitespace-pre-wrap text-justify leading-relaxed text-sm text-slate-600">
            {coverLetter.letterBody || (
              <span className="text-slate-400 italic">
                [Your cover letter body will appear here. Submit the form to generate your content.]
              </span>
            )}
          </div>

          {/* Sign-off */}
          <div className="mt-auto pt-8">
            <p className="text-sm text-slate-500 mb-4 uppercase font-bold tracking-widest">Sincerely,</p>
            <p className="text-xl font-black text-[#fb7185] uppercase tracking-tighter">
              {senderName}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Accent */}
      <div className="h-2 w-full bg-[#fef2f2] mt-auto shrink-0"></div>
    </div>
  );
}
