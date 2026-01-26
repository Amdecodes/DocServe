import { CoverLetterData, PersonalInfo } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function ModernSidebarCoverLetter({
  coverLetter,
  personalInfo,
}: {
  coverLetter: CoverLetterData;
  personalInfo: PersonalInfo;
}) {
  if (!coverLetter || !personalInfo) return null;
  const senderName =
    `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Your Name";

  // Helper to ensure URL has protocol (needed for clickable PDF links)
  const formatUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  // Helper for ribbon header style
  const RibbonHeader = ({ title }: { title: string }) => (
    <div className="relative mb-6">
      <div className="bg-[#1F1F1F] text-white py-2 px-6 pr-8 inline-block relative z-10 shadow-md">
        <h3 className="text-lg font-bold uppercase tracking-wider">{title}</h3>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-[297mm] w-full font-sans text-[#333] bg-white flex"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* LEFT SIDEBAR - Contact Info */}
      <div className="w-[30%] bg-[#E5E5E5] pt-16 min-h-full flex flex-col">
          <div className="pl-8">
            <RibbonHeader title="My Details" />
          </div>
          
          <div className="px-8 space-y-6 text-sm mb-12">
             {personalInfo.phone && (
              <div>
                <p className="font-bold text-black mb-1 flex items-center gap-2">Phone</p>
                <p className="text-gray-700 flex items-center gap-2"><Phone size={12}/> {personalInfo.phone}</p>
              </div>
            )}
            {personalInfo.email && (
              <div>
                <p className="font-bold text-black mb-1">Email</p>
                <p className="text-gray-700 flex items-center gap-2 break-all"><Mail size={12}/> {personalInfo.email}</p>
              </div>
            )}
             {(personalInfo.city || personalInfo.country) && (
               <div>
                <p className="font-bold text-black mb-1">Address</p>
                <p className="text-gray-700 flex items-center gap-2">
                   <MapPin size={12}/>
                  {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : personalInfo.city || personalInfo.country}
                </p>
              </div>
            )}
             {personalInfo.linkedin && (
               <div>
                <p className="font-bold text-black mb-1">LinkedIn</p>
                <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline flex items-center gap-2"><Linkedin size={12}/> View Profile</a>
              </div>
            )}
             {personalInfo.website && (
               <div>
                <p className="font-bold text-black mb-1">Portfolio</p>
                <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline flex items-center gap-2"><Globe size={12}/> View Portfolio</a>
              </div>
            )}
          </div>

          <div className="pl-8 mt-auto mb-16">
             <div className="w-16 h-1 bg-[#1F1F1F] mb-4"></div>
             <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                {new Date().toLocaleDateString("en-US", { year: 'numeric' })} Cover Letter
             </p>
          </div>
      </div>

      {/* RIGHT CONTENT - The Letter */}
      <div className="flex-1 p-16 pt-16">
        
        {/* Header */}
        <div className="mb-12 border-b-2 border-gray-100 pb-8">
          <h1 className="text-5xl font-black uppercase tracking-wide text-[#1F1F1F] mb-2 leading-none">
            {personalInfo.firstName} <br /> {personalInfo.lastName}
          </h1>
          <p className="text-xl uppercase tracking-[0.2em] text-gray-600 font-medium">
            {personalInfo.jobTitle || "Professional Title"}
          </p>
        </div>

        {/* Date & Recipient Block */}
        <div className="mb-10 text-sm flex justify-between items-start">
             <div>
                <p className="font-bold text-[#1F1F1F] text-lg mb-1">{coverLetter.recipientName || "Hiring Manager"}</p>
                <p className="text-gray-600">{coverLetter.jobTitle}</p>
                <p className="text-gray-600">{coverLetter.companyName}</p>
             </div>
             <div className="text-right">
                <p className="font-bold text-[#1F1F1F]">Date</p>
                <p className="text-gray-600">{new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
             </div>
        </div>

        {/* Salutation */}
        <div className="mb-6 text-sm text-[#1F1F1F] font-bold">
          <p>Dear {coverLetter.recipientName ? `Mr./Ms. ${coverLetter.recipientName.split(' ').pop()}` : "Hiring Manager"},</p>
        </div>

        {/* Body */}
        <div className="mb-10 whitespace-pre-wrap text-sm leading-8 text-gray-600 text-justify">
          {coverLetter.letterBody || (
            <span className="text-gray-400 italic">
              [Your cover letter body will appear here. Fill in the Cover Letter step to see your content.]
            </span>
          )}
        </div>

        {/* Sign-off */}
        <div className="mt-12 pt-8">
          <p className="mb-2 text-gray-600">Sincerely,</p>
          <p className="font-black text-[#1F1F1F] text-xl tracking-wide border-b-2 border-[#1F1F1F] inline-block pb-1">{senderName}</p>
        </div>
      </div>
    </div>
  );
}
