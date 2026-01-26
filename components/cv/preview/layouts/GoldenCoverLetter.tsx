import { CoverLetterData, PersonalInfo } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function GoldenCoverLetter({
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
      className="min-h-[297mm] w-full font-serif text-gray-800 bg-white flex flex-col"
    >
       {/* Header - Full Width */}
       <header className="bg-[#1e293b] text-white py-12 px-10 text-center">
        <h1 className="text-5xl font-bold uppercase tracking-widest text-[#d4af37] mb-2 font-serif">
          {senderName}
        </h1>
        <p className="text-xl tracking-widest uppercase text-[#d4af37]/90 font-light">
          {personalInfo.jobTitle || "Job Title"}
        </p>
      </header>

      <div 
        className="flex flex-1"
        style={{
          background: "linear-gradient(to right, #f3f4f6 33.333333%, white 33.333333%)",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact"
        }}
      >
        {/* Left Sidebar */}
        <aside className="w-1/3 p-8 space-y-8 border-r border-gray-200/50">
           {/* Contact */}
           <section className="break-inside-avoid">
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-4 border-b-2 border-[#d4af37] pb-1 inline-block">
              Contact
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1e293b] mt-1 shrink-0" />
                <span>
                 {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : "Addis Ababa, Ethiopia"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#1e293b] shrink-0" />
                <span>{personalInfo.email || "email@example.com"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#1e293b] shrink-0" />
                <span>{personalInfo.phone || "+251 900 000 000"}</span>
              </div>
              {personalInfo.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-[#1e293b] shrink-0" />
                  <a href={formatUrl(personalInfo.linkedin)} className="hover:text-[#d4af37]">LinkedIn</a>
                </div>
              )}
               {personalInfo.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#1e293b] shrink-0" />
                  <a href={formatUrl(personalInfo.website)} className="hover:text-[#d4af37]">Portfolio</a>
                </div>
              )}
            </div>
          </section>
        </aside>

        {/* Right Content */}
        <main className="flex-1 p-10">
           <h2 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-8 border-b-2 border-[#1e293b] pb-1 inline-block">
            Cover Letter
          </h2>

          {/* Recipient Info */}
          <div className="mb-8 text-sm text-gray-800">
             <p className="font-bold">{coverLetter.recipientName || "Hiring Manager"}</p>
             <p className="italic">{coverLetter.jobTitle}</p>
             <p>{coverLetter.companyName}</p>
             {/* Date moved to bottom right or top right? Image shows date at bottom right. */}
          </div>

          {/* Salutation */}
          <div className="mb-6 text-sm">
            <p>Dear {coverLetter.recipientName ? `Mr./Ms. ${coverLetter.recipientName.split(' ').pop()}` : "Hiring Manager"},</p>
          </div>

          {/* Body */}
           <div className="mb-8 whitespace-pre-wrap text-justify text-sm leading-relaxed text-gray-700">
            {coverLetter.letterBody || (
              <span className="text-gray-400 italic">
                [Your cover letter body will appear here. Fill in the Cover Letter
                step to see your content.]
              </span>
            )}
          </div>

          {/* Sign-off */}
          <div className="mt-12 text-sm">
            <p>Sincerely,</p>
            <br />
            <p className="font-bold text-[#1e293b] text-lg font-serif">{senderName}</p>
          </div>
          
           {/* Date at bottom right like in image example */}
           <div className="mt-12 text-right text-sm text-gray-600">
             <p>{new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
           </div>

        </main>
      </div>
    </div>
  );
}
