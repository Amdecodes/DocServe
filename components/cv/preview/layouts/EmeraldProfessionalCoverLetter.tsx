import { CoverLetterData, PersonalInfo } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function EmeraldProfessionalCoverLetter({
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
      {/* HEADER - Matches Resume */}
      <div className="p-16 pb-8 border-b border-emerald-100">
         <div className="flex justify-between items-start">
             <div>
                <h1 className="text-5xl font-bold uppercase tracking-wide text-[#064e3b] mb-2 font-serif">
                  {personalInfo.firstName} <span className="font-light text-[#059669]">{personalInfo.lastName}</span>
                </h1>
                <p className="text-xl tracking-[0.2em] text-slate-500 uppercase font-medium mb-6">
                  {personalInfo.jobTitle || "Professional Title"}
                </p>
             </div>
             
             {/* Date Block aligned right */}
             <div className="text-right pt-2">
                <p className="text-sm font-bold text-[#059669] uppercase tracking-widest mb-1">Date</p>
                <p className="text-slate-700 font-medium">{new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
             </div>
         </div>

         {/* Contact Grid - Horizontal */}
         <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-600 mt-2">
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#059669]" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#059669]" />
                <span>{personalInfo.email}</span>
              </div>
            )}
              {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin size={14} className="text-[#059669]" />
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#059669] transition-colors">LinkedIn</a>
              </div>
            )}
              {(personalInfo.city || personalInfo.country) && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#059669]" />
                <span>
                  {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : personalInfo.city || personalInfo.country}
                </span>
              </div>
            )}
         </div>
      </div>

      <div className="flex-1 p-16 pt-12 max-w-4xl mx-auto w-full">
        
        {/* Recipient Block */}
        <div className="mb-12 pl-6 border-l-4 border-emerald-500">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">To</p>
           <p className="font-serif font-bold text-2xl text-[#064e3b] mb-1">{coverLetter.recipientName || "Hiring Manager"}</p>
           <p className="text-slate-800 font-medium">{coverLetter.jobTitle}</p>
           <p className="text-slate-600">{coverLetter.companyName}</p>
        </div>

        {/* Salutation */}
        <div className="mb-8 text-xl font-medium text-slate-900">
          <p>Dear {coverLetter.recipientName ? `Mr./Ms. ${coverLetter.recipientName.split(' ').pop()}` : "Hiring Manager"},</p>
        </div>

        {/* Body */}
        <div className="mb-16 whitespace-pre-wrap text-lg leading-9 text-slate-600 text-justify">
          {coverLetter.letterBody || (
            <span className="text-slate-400 italic">
              [Your cover letter body will appear here. Fill in the Cover Letter step to see your content.]
            </span>
          )}
        </div>

        {/* Sign-off */}
        <div className="mt-auto pt-8 border-t border-emerald-50">
          <p className="mb-4 text-slate-500">Sincerely,</p>
          <p className="font-bold text-[#064e3b] text-3xl font-serif">{senderName}</p>
        </div>

      </div>
    </div>
  );
}
