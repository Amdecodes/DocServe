import { CoverLetterData, PersonalInfo } from "@/types/cv";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export function LavenderCoverLetter({
  coverLetter,
  personalInfo,
}: {
  coverLetter: CoverLetterData;
  personalInfo: PersonalInfo;
}) {
  if (!coverLetter || !personalInfo) return null;
  const senderName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Your Name";

  const formatUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
     <div className="min-h-[297mm] w-full font-sans text-gray-800 bg-white p-12">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-violet-600 mb-4">
          {senderName}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-600">
          {personalInfo.city && personalInfo.country && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{personalInfo.city}, {personalInfo.country}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <a href={formatUrl(personalInfo.website)} className="hover:text-violet-600">
                {personalInfo.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto border-t border-gray-100 pt-10">
        <div className="flex justify-between items-start mb-10">
          {/* Recipient Info */}
          <div className="text-sm space-y-1">
            <p className="font-bold text-gray-900">{coverLetter.recipientName || "[Recipient Name]"}</p>
            <p className="text-gray-600 italic">{coverLetter.jobTitle || "[Job Title]"}</p>
            <p className="text-gray-600">{coverLetter.companyName || "[Company Name]"}</p>
          </div>
          
          {/* Date */}
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
        </div>

        {/* Salutation */}
        <div className="mb-6 text-sm">
          <p className="text-gray-900">
            Dear {coverLetter.recipientName ? `Mr./Ms. ${coverLetter.recipientName.split(' ').pop()}` : "Hiring Manager"},
          </p>
        </div>

        {/* Body */}
        <div className="mb-10 whitespace-pre-wrap text-justify text-sm leading-relaxed text-gray-700">
          {coverLetter.letterBody || (
            <span className="text-gray-400 italic">
              [Your cover letter body will appear here. Fill in the Cover Letter
              step to see your content.]
            </span>
          )}
        </div>

        {/* Sign-off */}
        <div className="mt-12 text-sm">
          <p className="text-gray-600">Sincerely,</p>
          <div className="mt-4">
            <p className="text-xl font-bold text-violet-600 tracking-tight">{senderName}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
