import { CoverLetterData, PersonalInfo } from "@/types/cv";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function ModernDarkCoverLetter({
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
      className="min-h-[297mm] w-full font-sans text-black bg-white flex flex-col p-16"
      style={{
        background: "#FFFFFF",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-6xl font-bold uppercase tracking-wide mb-3 leading-none">
          {personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span>
        </h1>
        <p className="text-xl tracking-[0.2em] uppercase text-[#D4AF37] font-medium">
          {personalInfo.jobTitle || "Professional Title"}
        </p>
      </div>

      <div className="border-t border-gray-200 mb-8"></div>

      {/* Contact Info Row */}
      <div className="flex flex-wrap gap-8 text-sm text-gray-600 mb-12 items-center">
        {personalInfo.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>{personalInfo.phone}</span>
          </div>
        )}
        {personalInfo.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#D4AF37]" />
            <span>{personalInfo.email}</span>
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-[#D4AF37]" />
             <a href={personalInfo.linkedin} className="hover:text-[#D4AF37] transition-colors">LinkedIn</a>
          </div>
        )}
         {personalInfo.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#D4AF37]" />
             <a href={personalInfo.website} className="hover:text-[#D4AF37] transition-colors">Portfolio</a>
          </div>
        )}
        {(personalInfo.city || personalInfo.country) && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {personalInfo.city && personalInfo.country
                ? `${personalInfo.city}, ${personalInfo.country}`
                : personalInfo.city || personalInfo.country}
            </span>
          </div>
        )}
      </div>


      {/* Recipient */}
      <div className="mb-10 text-sm">
        <p className="font-bold text-black text-lg mb-1">{coverLetter.recipientName || "Hiring Manager"}</p>
        <p className="text-gray-500">{coverLetter.jobTitle}</p>
        <p className="text-gray-500">{coverLetter.companyName}</p>
      </div>

      {/* Salutation */}
      <div className="mb-6 text-sm">
        <p>Dear {coverLetter.recipientName ? `Mr./Ms. ${coverLetter.recipientName.split(' ').pop()}` : "Hiring Manager"},</p>
      </div>

      {/* Body */}
      <div className="mb-10 whitespace-pre-wrap text-sm leading-8 text-gray-700 text-justify">
        {coverLetter.letterBody || (
          <span className="text-gray-400 italic">
            [Your cover letter body will appear here. Fill in the Cover Letter step to see your content.]
          </span>
        )}
      </div>

      {/* Sign-off */}
      <div className="mt-auto pt-12 text-sm">
        <p className="mb-4 text-gray-500">Sincerely,</p>
        <p className="font-bold text-[#D4AF37] text-xl tracking-wide">{senderName}</p>
      </div>
    </div>
  );
}