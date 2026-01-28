import { CoverLetterData, PersonalInfo } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function CorporateFocusCoverLetter({
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
      className="min-h-[297mm] w-full font-sans text-slate-800 bg-white flex flex-col"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* Header - Deep Corporate Blue */}
      <div className="bg-[#1a365d] text-white p-16 pb-12">
         <h1 className="text-5xl font-bold uppercase tracking-wide mb-2">
            {personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span>
         </h1>
         <p className="text-xl tracking-widest text-[#90cdf4] font-medium uppercase mb-8">
            {personalInfo.jobTitle || "Professional Title"}
         </p>

         <div className="flex flex-wrap gap-6 text-sm font-light text-slate-200">
             {personalInfo.phone && (
              <div className="flex items-center gap-2">
                 <Phone size={14} className="text-[#90cdf4]" />
                 <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#90cdf4]" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
               <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#90cdf4]" />
                <span>
                  {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : personalInfo.city || personalInfo.country}
                </span>
              </div>
            )}
             {personalInfo.linkedin && (
               <div className="flex items-center gap-2">
                <Linkedin size={14} className="text-[#90cdf4]" />
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            )}
             {personalInfo.website && (
               <div className="flex items-center gap-2">
                <Globe size={14} className="text-[#90cdf4]" />
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Portfolio</a>
              </div>
            )}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-16 pt-12 max-w-4xl mx-auto w-full">
        
        {/* Recipient Block */}
        <div className="mb-12 border-l-4 border-[#1a365d] pl-6 py-1">
          <p className="text-sm text-slate-500 mb-1 font-bold uppercase tracking-wider">To</p>
          <p className="font-bold text-xl text-[#1a365d] mb-1">{coverLetter.recipientName || "Hiring Manager"}</p>
          <p className="text-slate-600 font-medium">{coverLetter.jobTitle}</p>
          <p className="text-slate-500">{coverLetter.companyName}</p>
        </div>

        {/* Date */}
        <div className="mb-8 text-right text-sm text-slate-500 font-medium">
           {new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        {/* Salutation */}
        <div className="mb-6 text-lg font-medium text-slate-800">
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
        <div className="mt-auto pt-8 border-t border-slate-200">
          <p className="mb-6 text-slate-600">Sincerely,</p>
          <p className="font-bold text-[#1a365d] text-2xl" style={{ fontFamily: 'serif' }}>{senderName}</p>
        </div>
      </div>
    </div>
  );
}
