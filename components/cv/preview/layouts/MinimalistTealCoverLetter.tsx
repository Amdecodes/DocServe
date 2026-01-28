import { CoverLetterData, PersonalInfo } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function MinimalistTealCoverLetter({
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
    <div 
      className="min-h-[297mm] w-full font-sans text-slate-700 bg-white flex flex-col"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* HEADER - Matches Resume */}
      <div className="bg-[#f0fdfa] border-b-4 border-[#0d9488] p-10 pb-8 text-center">
        <h1 className="text-5xl font-bold uppercase tracking-widest text-[#0f766e] mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl uppercase tracking-[0.3em] text-[#0d9488] font-light mb-6">
          {personalInfo.jobTitle || "Professional Title"}
        </p>

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                 <Phone size={14} className="text-[#0d9488]" />
                 <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#0d9488]" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
               <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#0d9488]" />
                <span>
                  {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : personalInfo.city || personalInfo.country}
                </span>
              </div>
            )}
             {personalInfo.linkedin && (
               <div className="flex items-center gap-2">
                <Linkedin size={14} className="text-[#0d9488]" />
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#0d9488] transition-colors">LinkedIn</a>
              </div>
            )}
             {personalInfo.website && (
               <div className="flex items-center gap-2">
                <Globe size={14} className="text-[#0d9488]" />
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#0d9488] transition-colors">Portfolio</a>
              </div>
            )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-16 pt-12 max-w-4xl mx-auto w-full">
        
        {/* Date */}
        <div className="mb-10 text-right text-sm text-[#0f766e] font-bold uppercase tracking-wider">
           {new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        {/* Recipient Block */}
        <div className="mb-12">
          <p className="text-xl font-bold text-[#0f766e] mb-1 uppercase tracking-wide">To: {coverLetter.recipientName || "Hiring Manager"}</p>
          <p className="text-slate-600 font-medium">{coverLetter.jobTitle}</p>
          <p className="text-slate-500">{coverLetter.companyName}</p>
        </div>

        {/* Salutation */}
        <div className="mb-8 text-lg font-medium text-slate-800">
          <p>Dear {coverLetter.recipientName ? `Mr./Ms. ${coverLetter.recipientName.split(' ').pop()}` : "Hiring Manager"},</p>
        </div>

        {/* Body */}
        <div className="mb-12 whitespace-pre-wrap text-base leading-8 text-slate-600 text-justify">
          {coverLetter.letterBody || (
            <span className="text-slate-400 italic">
              [Your cover letter body will appear here. Fill in the Cover Letter step to see your content.]
            </span>
          )}
        </div>

        {/* Sign-off */}
        <div className="mt-auto pt-8 border-t-2 border-[#f0fdfa]">
          <p className="mb-6 text-slate-600">Sincerely,</p>
          <p className="font-bold text-[#0d9488] text-2xl tracking-wide">{senderName}</p>
        </div>
      </div>
    </div>
  );
}
