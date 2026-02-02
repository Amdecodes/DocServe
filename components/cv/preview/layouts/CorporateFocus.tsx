import { CVData } from "@/types/cv";
import Image from "next/image";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe, Cake } from "lucide-react";

export function CorporateFocusLayout({ data }: { data: CVData }) {
  if (!data) return null;
  const personalInfo = data.personalInfo || {};
  const summary = data.summary || "";
  
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const volunteer = data.volunteer || [];
  const coreCompetencies = data.coreCompetencies || [];

  // Helper to ensure URL has protocol
  const formatUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
    <div 
      className="min-h-[297mm] w-full font-sans text-slate-800 bg-white flex"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* LEFT SIDEBAR - Deep Corporate Blue */}
      <div className="w-[32%] bg-[#1a365d] text-white pt-12 min-h-full flex flex-col items-center">
        
        {/* Photo Section */}
        <div className="px-6 mb-10 w-full flex justify-center">
          {personalInfo.photo ? (
            <div className="w-40 h-40 rounded-full border-4 border-[#2c5282] overflow-hidden shadow-lg relative">
              <Image
                src={personalInfo.photo}
                alt={personalInfo.firstName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ) : (
             <div className="w-40 h-40 rounded-full border-4 border-[#2c5282] bg-slate-700 flex items-center justify-center text-4xl font-bold text-slate-400">
                {personalInfo.firstName?.[0]}
             </div>
          )}
        </div>

        {/* Contact info in sidebar */}
        <div className="w-full px-8 mb-10 space-y-4 text-sm font-light">
           <h3 className="text-[#90cdf4] font-bold uppercase tracking-widest text-xs border-b border-[#2c5282] pb-2 mb-4">Contact</h3>
           
            {personalInfo.phone && (
              <div className="flex items-center gap-3">
                 <Phone size={14} className="shrink-0 text-[#90cdf4]" />
                 <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-3">
                <Mail size={14} className="shrink-0 text-[#90cdf4]" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
               <div className="flex items-center gap-3">
                <MapPin size={14} className="shrink-0 text-[#90cdf4]" />
                <span>
                  {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : personalInfo.city || personalInfo.country}
                </span>
              </div>
            )}
            {personalInfo.dateOfBirth && (
              <div className="flex items-center gap-3">
                <Cake size={14} className="shrink-0 text-[#90cdf4]" />
                <span>Date of Birth: {personalInfo.dateOfBirth}</span>
              </div>
            )}
            {personalInfo.linkedin && (
               <div className="flex items-center gap-3">
                <Linkedin size={14} className="shrink-0 text-[#90cdf4]" />
                <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-[#90cdf4] transition-colors">
                   LinkedIn
                </a>
              </div>
            )}
              {personalInfo.website && (
               <div className="flex items-center gap-3">
                <Globe size={14} className="shrink-0 text-[#90cdf4]" />
                <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:text-[#90cdf4] transition-colors">
                  Portfolio
                </a>
              </div>
            )}
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div className="w-full px-8 mb-10">
             <h3 className="text-[#90cdf4] font-bold uppercase tracking-widest text-xs border-b border-[#2c5282] pb-2 mb-4">Education</h3>
             <div className="space-y-6">
               {education.map((edu, idx) => (
                 <div key={idx}>
                   <p className="font-bold text-white text-sm">{edu.degree}</p>
                   <p className="text-xs text-[#bee3f8]">{edu.school}</p>
                   <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">{edu.startDate} - {edu.endDate}</p>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="w-full px-8 mb-10">
            <h3 className="text-[#90cdf4] font-bold uppercase tracking-widest text-xs border-b border-[#2c5282] pb-2 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-[#2c5282] rounded text-xs text-white">
                    {skill.name}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="w-full px-8 mb-10">
            <h3 className="text-[#90cdf4] font-bold uppercase tracking-widest text-xs border-b border-[#2c5282] pb-2 mb-4">Languages</h3>
            <ul className="space-y-2 text-sm">
                {languages.map((lang, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span>{lang.language}</span>
                    <span className="text-xs text-slate-400">{lang.proficiency}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

      </div>

      {/* RIGHT CONTENT - White Background */}
      <div className="flex-1 p-12">
        
        {/* Header Name */}
        <div className="mb-10 border-b-2 border-[#1a365d] pb-6">
          <h1 className="text-5xl font-bold uppercase tracking-tight text-[#1a365d] mb-2">
            {personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span>
          </h1>
          <p className="text-xl uppercase tracking-widest text-slate-500 font-medium">
            {personalInfo.jobTitle || "Professional Title"}
          </p>
        </div>

        {/* Summary */}
        {summary && (
           <div className="mb-10">
             <h2 className="text-lg font-bold text-[#1a365d] mb-3 uppercase flex items-center gap-2">
               <span className="w-8 h-1 bg-[#1a365d] inline-block"></span>
               About Me
             </h2>
             <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
                <p className="text-sm text-slate-600 leading-relaxed text-justify">
                  {typeof summary === "string" ? summary : ""}
                </p>
              </AIBlurOverlay>
           </div>
        )}

        {/* Experience */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#1a365d] mb-6 uppercase flex items-center gap-2">
              <span className="w-8 h-1 bg-[#1a365d] inline-block"></span>
              Experience
          </h2>
          
          <div className="space-y-8">
            {experience.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No experience added yet.</p>
            ) : (
              experience.map((exp, idx) => (
                <div key={idx} style={{ pageBreakInside: "avoid" }}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-lg text-slate-800">{exp.jobTitle}</h3>
                    <span className="text-xs font-bold text-[#1a365d] bg-slate-100 px-2 py-1 rounded">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3 font-medium">{exp.company} | {exp.location || "Remote"}</p>
                  
                  <AIBlurOverlay type="bullets" isGenerated={data.aiMetadata?.generated}>
                    <ul className="space-y-1.5 text-sm text-slate-600 leading-relaxed list-disc list-outside ml-4 marker:text-[#1a365d]">
                      {(exp.achievements && exp.achievements.length > 0 ? exp.achievements : [exp.description]).filter(Boolean).map((point, i) => (
                        <li key={i} className="pl-1">
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </AIBlurOverlay>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Core Competencies */}
        {coreCompetencies.length > 0 && (
          <section style={{ pageBreakInside: "avoid" }} className="mb-8">
            <h2 className="text-lg font-bold text-[#1a365d] mb-4 uppercase flex items-center gap-2">
                <span className="w-8 h-1 bg-[#1a365d] inline-block"></span>
                Expertise
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {coreCompetencies.map((comp, idx) => (
                     <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 bg-[#90cdf4] rounded-full shrink-0"></div>
                        <span>{comp}</span>
                     </div>
                ))}
            </div>
          </section>
        )}

        {/* Volunteer */}
        {volunteer.length > 0 && (
          <section style={{ pageBreakInside: "avoid" }}>
            <h2 className="text-lg font-bold text-[#1a365d] mb-4 uppercase flex items-center gap-2">
                <span className="w-8 h-1 bg-[#1a365d] inline-block"></span>
                Volunteering
            </h2>
            <div className="space-y-4">
                {volunteer.map((vol, idx) => (
                     <div key={idx} className="text-sm">
                        <div className="font-bold text-slate-800">
                           <span>{vol.role}</span>
                        </div>
                        <div className="text-slate-500 text-xs italic">{vol.organization}</div>
                        <p className="text-slate-600 mt-1">{vol.description}</p>
                     </div>
                ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
