import { CoverLetterData, PersonalInfo } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function ElegantCoverLetter({
  coverLetter,
  personalInfo,
}: {
  coverLetter: CoverLetterData;
  personalInfo: PersonalInfo;
}) {
  if (!coverLetter || !personalInfo) return null;
  const senderName =
    `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Your Name";

  const formatUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
    <div 
      className="min-h-[297mm] w-full font-sans text-[#1f1f1f] bg-white flex flex-col"
    >
      <div 
        className="flex flex-1"
        style={{
          background: "white",
          minHeight: "100%",
          display: "flex"
        }}
      >
        {/* Left Sidebar - Width ~35% */}
        <aside className="w-[35%] py-12 pl-10 pr-8 border-r border-gray-300 flex flex-col gap-10">
           {/* Contact */}
           <section>
            <h3 className="text-lg font-bold uppercase tracking-wider text-[#3e3430] mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <span>{personalInfo.phone || "+251 900 000 000"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="break-all">{personalInfo.email || "email@example.com"}</span>
              </div>
              {personalInfo.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-500 shrink-0" />
                  <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:text-[#3e3430] underline decoration-dotted">Portfolio</a>
                </div>
              )}
               {personalInfo.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-gray-500 shrink-0" />
                  <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-[#3e3430] underline decoration-dotted">LinkedIn</a>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-1 shrink-0" />
                <span className="leading-tight">
                 {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : "Addis Ababa, Ethiopia"}
                </span>
              </div>
            </div>
          </section>
        </aside>

        {/* Right Content - Width ~65% */}
        <main className="w-[65%] py-12 px-10 flex flex-col gap-8">
           {/* Header */}
           <header>
            <h1 className="text-5xl font-serif text-[#2d2424] mb-2 leading-none">
              {personalInfo.firstName} <br />
              {personalInfo.lastName}
            </h1>
            <p className="text-xl text-gray-600 font-light mt-4">
              {personalInfo.jobTitle || "Professional Title"}
            </p>
          </header>

          <hr className="border-gray-200" />

          {/* Recipient Block */}
          <div className="text-sm text-gray-800 space-y-1">
             <p className="font-bold">{coverLetter.recipientName || "Hiring Manager"}</p>
             <p className="text-gray-600">{coverLetter.jobTitle}</p>
             <p className="text-gray-600">{coverLetter.companyName}</p>
          </div>

          {/* Letter Body */}
          <div className="text-sm text-gray-700 leading-7 text-justify whitespace-pre-wrap">
            <p className="mb-4">Dear {coverLetter.recipientName ? `Mr./Ms. ${coverLetter.recipientName.split(' ').pop()}` : "Hiring Manager"},</p>
            {coverLetter.letterBody || (
              <span className="text-gray-400 italic">
                [Your cover letter body will appear here. Fill in the Cover Letter step to see your content.]
              </span>
            )}
          </div>

          {/* Sign-off */}
          <div className="mt-8 text-sm text-gray-800">
            <p>Sincerely,</p>
            <br />
            <p className="font-bold text-[#2d2424] text-lg font-serif">{senderName}</p>
          </div>

        </main>
      </div>
    </div>
  );
}
