import { CoverLetterData, PersonalInfo } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function CreativeSplitCoverLetter({
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
      {/* HEADER - Matches Resume Split Design */}
      <div className="flex bg-[#312e81] text-white min-h-[160px]">
         <div className="flex-1 p-10 flex flex-col justify-center bg-[#3730a3]">
            <h1 className="text-5xl font-black uppercase tracking-tight mb-2 leading-none">
              {personalInfo.firstName} <br /> {personalInfo.lastName}
            </h1>
            <p className="text-xl text-[#c7d2fe] tracking-widest font-medium uppercase mt-2">
              {personalInfo.jobTitle || "Professional Title"}
            </p>
         </div>
         {/* Decorative Right Block */}
         <div className="w-[30%] bg-[#312e81] relative">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#4338ca] opacity-50"></div>
         </div>
      </div>

       {/* SUB-HEADER: Contact Bar */}
       <div className="bg-[#1e1b4b] text-white py-4 px-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-light">
          {personalInfo.phone && (
              <div className="flex items-center gap-2">
                 <Phone size={14} className="text-[#818cf8]" />
                 <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#818cf8]" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
               <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#818cf8]" />
                <span>
                  {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : personalInfo.city || personalInfo.country}
                </span>
              </div>
            )}
            {personalInfo.linkedin && (
               <div className="flex items-center gap-2">
                <Linkedin size={14} className="text-[#818cf8]" />
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#818cf8] transition-colors">LinkedIn</a>
              </div>
            )}
             {personalInfo.website && (
               <div className="flex items-center gap-2">
                <Globe size={14} className="text-[#818cf8]" />
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#818cf8] transition-colors">Portfolio</a>
              </div>
            )}
       </div>

      {/* Main Content */}
      <div className="flex-1 flex">
          
          {/* Content Area */}
          <div className="flex-1 p-16 pt-12 max-w-4xl mx-auto w-full">
            
            <div className="flex justify-between items-end mb-12 border-b-2 border-indigo-100 pb-6">
               {/* Recipient */}
               <div>
                  <p className="text-sm font-bold text-[#4338ca] uppercase mb-1 tracking-wider">Recipient</p>
                  <p className="font-bold text-xl text-slate-900 mb-1">{coverLetter.recipientName || "Hiring Manager"}</p>
                  <p className="text-slate-600">{coverLetter.jobTitle}</p>
                  <p className="text-slate-500">{coverLetter.companyName}</p>
               </div>
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
            <div className="mt-auto pt-8">
              <p className="mb-6 text-slate-600">Sincerely,</p>
              <div className="inline-block relative">
                 <p className="font-bold text-[#312e81] text-2xl tracking-wide relative z-10">{senderName}</p>
                 <div className="absolute bottom-1 left-0 w-full h-3 bg-[#c7d2fe] -z-0 opacity-50 transform -skew-x-12"></div>
              </div>
            </div>
          </div>
          
      </div>
    </div>
  );
}
