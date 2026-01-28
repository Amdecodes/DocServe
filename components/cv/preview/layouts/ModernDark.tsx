import { CVData } from "@/types/cv";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function ModernDarkLayout({ data }: { data: CVData }) {
  if (!data) return null;
  const personalInfo = data.personalInfo || {};
  const summary = data.summary || "";
  
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const volunteer = data.volunteer || [];
  const coreCompetencies = data.coreCompetencies || [];

  return (
    <div 
      className="min-h-[297mm] w-full font-sans text-black bg-white flex flex-col"
      style={{
        background: "#FFFFFF",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* Header Section */}
      <div className="flex items-start gap-10 p-12 pb-10">
        {/* Photo */}
        {personalInfo.photo && (
          <div className="shrink-0">
            <img
              src={personalInfo.photo}
              alt={personalInfo.firstName}
              className="w-48 h-56 object-cover border-[1px] border-gray-300"
            />
          </div>
        )}

        {/* Name, Title, and Summary (Header Content) */}
        <div className="flex-1 pt-4">
          <h1 className="text-6xl font-bold uppercase tracking-wide mb-3 leading-none">
            {personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span>
          </h1>
          <p className="text-xl tracking-[0.2em] uppercase text-[#D4AF37] font-medium mb-6">
            {personalInfo.jobTitle || "Professional Title"}
          </p>
          
          {/* Summary moved to Header to match Image clone style */}
          {summary && (
            <div className="mb-6 max-w-2xl">
              <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
                <p className="text-sm text-gray-700 leading-relaxed text-justify">
                  {typeof summary === "string" ? summary : ""}
                </p>
              </AIBlurOverlay>
            </div>
          )}

          {/* LinkedIn and Portfolio */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {personalInfo.linkedin && (
              <a 
                href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
              >
                <Linkedin size={16} className="text-[#D4AF37]" />
                <span>LinkedIn</span>
              </a>
            )}
            {personalInfo.website && (
              <a 
                href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
              >
                <Globe size={16} className="text-[#D4AF37]" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mx-12"></div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-10 p-12 pt-10 h-full">
        
        {/* Left Column (Narrower - 4/12) */}
        <div className="col-span-4 space-y-10">
          
          {/* Education */}
          {education.length > 0 && (
            <section style={{ pageBreakInside: "avoid" }}>
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37] mb-5 border-b border-gray-200 pb-2">
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-sm group">
                    <p className="font-bold text-black text-base mb-1">{edu.school}</p>
                    <p className="text-[#D4AF37] text-xs mb-1 uppercase tracking-wider">{edu.startDate} - {edu.endDate}</p>
                    <p className="text-gray-600">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section style={{ pageBreakInside: "avoid" }}>
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37] mb-5 border-b border-gray-200 pb-2">
                Language
              </h2>
              <ul className="space-y-2 text-sm">
                {languages.map((lang, idx) => (
                  <li key={idx} className="text-gray-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                    {lang.language}
                    <span className="text-xs text-gray-500">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {/* Volunteer & Community */}
          {volunteer.length > 0 && (
            <section style={{ pageBreakInside: "avoid" }}>
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37] mb-5 border-b border-gray-200 pb-2">
                Volunteer
              </h2>
              <ul className="space-y-2 text-sm">
                {volunteer.map((vol, idx) => (
                  <li key={idx} className="text-gray-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                    {vol.role}
                    <span className="text-xs text-gray-500">{vol.organization}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Hard Skills */}
          {skills.length > 0 && (
            <section style={{ pageBreakInside: "avoid" }}>
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37] mb-5 border-b border-gray-200 pb-2">
                Skills
              </h2>
              <ul className="space-y-2 text-sm">
                {skills.map((skill, idx) => (
                  <li key={idx} className="text-gray-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column (Wider - 8/12) */}
        <div className="col-span-8 space-y-10">
          
          {/* Experience */}
          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37] mb-6 border-b border-gray-200 pb-2">
              Experience
            </h2>
            <div className="space-y-8">
              {experience.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No experience added yet.</p>
              ) : (
                experience.map((exp, idx) => (
                  <div key={idx} style={{ pageBreakInside: "avoid" }}>
                    <div className="mb-3">
                      <h3 className="font-bold text-black text-lg">
                        {exp.jobTitle} <span className="text-[#D4AF37]">|</span> {exp.company}
                      </h3>
                      <p className="text-xs text-[#D4AF37] uppercase tracking-wider mt-1">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                    
                    <AIBlurOverlay type="bullets" isGenerated={data.aiMetadata?.generated}>
                      <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
                        {(exp.achievements && exp.achievements.length > 0 ? exp.achievements : [exp.description]).filter(Boolean).map((point, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-[#D4AF37] mt-1.5 text-[10px]">●</span>
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

          {/* Key Highlights / Core Competencies */}
          {coreCompetencies.length > 0 && (
            <section style={{ pageBreakInside: "avoid" }} className="mt-8 pt-4">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37] mb-6 border-b border-gray-200 pb-2">
                Key Highlights / Core Competencies
              </h2>
              <div className="flex flex-wrap gap-3">
                {coreCompetencies.map((cert, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-xs text-black tracking-wide shadow-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 mx-12 mt-auto"></div>

      {/* Footer Contact */}
      <div className="p-10 bg-white">
        <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-6 text-center">
          Contact Person
        </h2>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-gray-600">
          {personalInfo.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.country) && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>
                {personalInfo.city && personalInfo.country
                  ? `${personalInfo.city}, ${personalInfo.country}`
                  : personalInfo.city || personalInfo.country}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}