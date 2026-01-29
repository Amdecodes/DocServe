import { CVData } from "@/types/cv";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe, Cake } from "lucide-react";

export function ModernSidebarLayout({ data }: { data: CVData }) {
  if (!data) return null;
  const personalInfo = data.personalInfo || {};
  const summary = data.summary || "";
  
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const coreCompetencies = data.coreCompetencies || [];

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
      {/* Decorative Ribbon Fold Effect */}
      <div className="absolute top-0 left-0 h-full w-full">
         <div className="absolute top-full left-0 w-3 h-3 bg-black/30 transform skew-x-45 origin-top-left -z-10"></div>
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
      {/* LEFT SIDEBAR */}
      <div className="w-[34%] bg-[#E5E5E5] pt-12 min-h-full flex flex-col">
        
        {/* Photo Section */}
        <div className="px-8 mb-12 flex justify-center">
          {personalInfo.photo ? (
            <div className="w-48 h-48 rounded-full border-4 border-white overflow-hidden shadow-sm">
              <img
                src={personalInfo.photo}
                alt={personalInfo.firstName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
             <div className="w-48 h-48 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-500">
                {personalInfo.firstName?.[0]}
             </div>
          )}
        </div>

        {/* Contact */}
        <div className="px-0 mb-8">
          <div className="pl-8">
            <RibbonHeader title="Contact" />
          </div>
          <div className="px-8 space-y-5 text-sm">
            {personalInfo.phone && (
              <div>
                <p className="font-bold text-black mb-1 flex items-center gap-2">
                   <Phone size={14} /> Phone
                </p>
                <p className="text-gray-700">{personalInfo.phone}</p>
              </div>
            )}
            {personalInfo.email && (
              <div>
                <p className="font-bold text-black mb-1 flex items-center gap-2">
                  <Mail size={14} /> Email
                </p>
                <p className="text-gray-700 break-all">{personalInfo.email}</p>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
               <div>
                <p className="font-bold text-black mb-1 flex items-center gap-2">
                  <MapPin size={14} /> Address
                </p>
                <p className="text-gray-700">
                  {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : personalInfo.city || personalInfo.country}
                </p>
              </div>
            )}
            {personalInfo.linkedin && (
               <div>
                <p className="font-bold text-black mb-1 flex items-center gap-2">
                  <Linkedin size={14} /> LinkedIn
                </p>
                <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline break-all">
                  {personalInfo.linkedin.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
              {personalInfo.website && (
               <div>
                <p className="font-bold text-black mb-1 flex items-center gap-2">
                  <Globe size={14} /> Portfolio
                </p>
                <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline break-all">
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {personalInfo.dateOfBirth && (
              <div className="mt-4">
                <p className="font-bold text-black mb-1 flex items-center gap-2">
                   <Cake size={14} /> Date of Birth
                </p>
                <p className="text-gray-700">{personalInfo.dateOfBirth}</p>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div className="px-0 mb-8">
             <div className="pl-8">
                <RibbonHeader title="Education" />
            </div>
            <div className="px-8 space-y-6">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <p className="font-bold text-black text-sm">{edu.degree}</p>
                  <p className="text-sm text-gray-700">{edu.school}</p>
                  <p className="text-xs text-gray-500 mt-1">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="px-0 mb-8">
            <div className="pl-8">
                <RibbonHeader title="Skills" />
            </div>
            <div className="px-8">
              <ul className="space-y-2 text-sm text-gray-700">
                {skills.map((skill, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#333] rounded-full"></span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

         {/* Languages */}
         {languages.length > 0 && (
          <div className="px-0 mb-8">
            <div className="pl-8">
                <RibbonHeader title="Language" />
            </div>
            <div className="px-8">
              <ul className="space-y-2 text-sm text-gray-700">
                {languages.map((lang, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#333] rounded-full"></span>
                    {lang.language}
                    {lang.proficiency && (
                      <span className="text-xs text-gray-500">({lang.proficiency})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-12 pt-16">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black uppercase tracking-wide text-[#1F1F1F] mb-2 leading-none">
            {personalInfo.firstName} <br /> {personalInfo.lastName}
          </h1>
          <p className="text-xl uppercase tracking-[0.2em] text-gray-600 font-medium">
            {personalInfo.jobTitle}
          </p>
        </div>

        {/* Summary (Mapped from About Me requirement) */}
        {summary && (
           <div className="mb-10">
             <h2 className="text-xl font-bold text-[#1F1F1F] mb-4 uppercase tracking-wide">About Me</h2>
             <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {typeof summary === "string" ? summary : ""}
                </p>
              </AIBlurOverlay>
           </div>
        )}

        {/* Experience */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-8 uppercase tracking-wide">Professional Experience</h2>
          
          <div className="space-y-0">
            {experience.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No experience added yet.</p>
            ) : (
              experience.map((exp, idx) => (
                <div key={idx} className="flex group" style={{ pageBreakInside: "avoid" }}>
                  {/* Timeline Column */}
                  <div className="w-24 shrink-0 flex flex-col items-center pt-1 pr-4">
                    <span className="font-bold text-sm text-[#1F1F1F] text-right w-full block">
                        {exp.startDate}
                    </span>
                    <span className="text-xs text-gray-400 block mb-2">-</span>
                    <span className="font-bold text-sm text-[#1F1F1F] text-right w-full block">
                         {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>

                  {/* Content Column with Border */}
                  <div className={`flex-1 border-l-2 border-gray-200 pl-8 pb-10 ${idx === experience.length - 1 ? 'border-l-transparent' : ''}`}>
                    <h3 className="font-bold text-lg text-[#1F1F1F]">{exp.jobTitle}</h3>
                    <p className="text-sm text-gray-500 mb-3 italic">{exp.company} | {exp.location || "Remote"}</p>
                    
                    <AIBlurOverlay type="bullets" isGenerated={data.aiMetadata?.generated}>
                      <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
                        {(exp.achievements && exp.achievements.length > 0 ? exp.achievements : [exp.description]).filter(Boolean).map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                             <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full shrink-0"></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </AIBlurOverlay>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Key Highlights / Core Competencies (Replacing References) */}
        {coreCompetencies.length > 0 && (
          <section style={{ pageBreakInside: "avoid" }}>
            <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6 uppercase tracking-wide">Key Highlights</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {coreCompetencies.map((comp, idx) => (
                     <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 bg-[#1F1F1F] rounded-full shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">{comp}</span>
                     </div>
                ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
