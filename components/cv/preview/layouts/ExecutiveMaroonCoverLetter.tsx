import { CoverLetterData, PersonalInfo } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function ExecutiveMaroonCoverLetter({
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
      className="min-h-[297mm] w-full font-serif text-slate-800 bg-white flex flex-col"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* HEADER - Matches Resume */}
      <div className="bg-[#7f1d1d] text-white p-12 pb-10">
         <div className="flex justify-between items-center">
             <div>
                <h1 className="text-5xl font-bold uppercase tracking-wide mb-2">
                  {personalInfo.firstName} <span className="text-[#fecaca]">{personalInfo.lastName}</span>
                </h1>
                <p className="text-xl tracking-widest text-[#fecaca] uppercase font-medium">
                  {personalInfo.jobTitle || "Professional Title"}
                </p>
             </div>
         </div>

         {/* Contact Grid */}
         <div className="mt-8 pt-6 border-t border-[#991b1b] grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-sans text-white/90">
             {personalInfo.phone && (
              <div className="flex items-center gap-2">
                 <Phone size={14} className="text-[#fecaca]" />
                 <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#fecaca]" />
                <span className="truncate">{personalInfo.email}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
               <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#fecaca]" />
                <span>
                  {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : personalInfo.city || personalInfo.country}
                </span>
              </div>
            )}
             {personalInfo.linkedin && (
               <div className="flex items-center gap-2">
                <Linkedin size={14} className="text-[#fecaca]" />
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors truncate">LinkedIn</a>
              </div>
            )}
             {personalInfo.website && (
               <div className="flex items-center gap-2">
                <Globe size={14} className="text-[#fecaca]" />
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors truncate">Portfolio</a>
              </div>
            )}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-16 pt-16 max-w-4xl mx-auto w-full">
        
        {/* Date & Recipient Block */}
        <div className="flex justify-between items-start mb-16 border-b-2 border-slate-100 pb-10 font-sans">
           <div className="flex-1">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">To</p>
             <p className="font-serif font-bold text-2xl text-[#7f1d1d] mb-1">{coverLetter.recipientName || "Hiring Manager"}</p>
             <p className="text-slate-800 font-medium">{coverLetter.jobTitle}</p>
             <p className="text-slate-600">{coverLetter.companyName}</p>
           </div>
           
           <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date</p>
              <p className="text-slate-700 font-medium">{new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
           </div>
        </div>

        {/* Salutation */}
        <div className="mb-8 text-xl font-medium text-slate-900">
          <p>Dear {coverLetter.recipientName ? `Mr./Ms. ${coverLetter.recipientName.split(' ').pop()}` : "Hiring Manager"},</p>
        </div>

        {/* Body */}
        <div className="mb-16 whitespace-pre-wrap text-lg leading-9 text-slate-700 text-justify">
          {coverLetter.letterBody || (
            <span className="text-slate-400 italic">
              [Your cover letter body will appear here. Fill in the Cover Letter step to see your content.]
            </span>
          )}
        </div>

        {/* Sign-off */}
        <div className="mt-auto pt-8">
          <p className="mb-6 text-slate-600 font-sans">Sincerely,</p>
          <div className="border-b-4 border-[#7f1d1d] inline-block pb-2">
              <p className="font-bold text-slate-900 text-3xl tracking-wide">{senderName}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
