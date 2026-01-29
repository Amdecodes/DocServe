import { CVData } from "@/types/cv";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function GoldenLayout({ data }: { data: CVData }) {
  if (!data) return null;
  const personalInfo = data.personalInfo || {};
  const summary = data.summary || "";
  
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const volunteer = data.volunteer || [];

  const formatUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
    <div 
      className="min-h-[297mm] w-full font-serif text-gray-800 bg-white flex flex-col"
    >
      {/* Header - Full Width */}
      <header className="bg-[#1e293b] text-white py-12 px-10 text-center">
        <h1 className="text-5xl font-bold uppercase tracking-widest text-[#d4af37] mb-4 font-serif leading-tight">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl tracking-widest uppercase text-[#d4af37]/90 font-light mb-2">
          {personalInfo.jobTitle}
        </p>
        {(personalInfo.headline) && (
          <p className="text-sm tracking-wide text-white/80 max-w-2xl mx-auto italic font-sans normal-case">
            {personalInfo.headline}
          </p>
        )}
      </header>

      <div 
        className="flex flex-1"
        style={{
          background: "linear-gradient(to right, #f3f4f6 33.333333%, white 33.333333%)",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          display: "flex" // Ensure flex behavior for sidebar/main split
        }}
      >
        {/* Left Sidebar */}
        <aside className="w-1/3 p-8 space-y-8 border-r border-gray-200/50">
          {/* Contact */}
          <section className="break-inside-avoid">
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-4 border-b-2 border-[#d4af37] pb-1 inline-block">
              Contact
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1e293b] mt-1 shrink-0" />
                <span>
                  {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : personalInfo.city || personalInfo.country}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#1e293b] shrink-0" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#1e293b] shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
              {personalInfo.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#1e293b] shrink-0" />
                  <span>DOB: {personalInfo.dateOfBirth}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-[#1e293b] shrink-0" />
                  <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] underline decoration-dotted underline-offset-4">LinkedIn</a>
                </div>
              )}
               {personalInfo.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#1e293b] shrink-0" />
                  <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] underline decoration-dotted underline-offset-4">Portfolio</a>
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section className="break-inside-avoid">
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-4 border-b-2 border-[#d4af37] pb-1 inline-block">
                Skills
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {skills.map((skill, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#d4af37] transform rotate-45 shrink-0"></span>
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
             <section style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-4 border-b-2 border-[#d4af37] pb-1 inline-block">
                Education
              </h3>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-bold text-[#1e293b]">{edu.degree}</p>
                    <p className="italic text-gray-600">{edu.school}</p>
                    <p className="text-gray-500 text-xs mt-1">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests - Optional, if available in data type? Checked and it's not in base CVData but maybe handled in generic? Modern doesn't show it except mapped if available. 
             Wait, image showed "Interests". I'll skip if not in data.
             Let's check Languages though.
           */}
           {languages.length > 0 && (
            <section className="break-inside-avoid">
               <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-4 border-b-2 border-[#d4af37] pb-1 inline-block">
                Languages
              </h3>
               <ul className="space-y-2 text-sm text-gray-700">
                {languages.map((lang, idx) => (
                  <li key={idx} className="flex flex-col">
                    <span className="font-semibold">{lang.language}</span>
                    <span className="text-xs text-gray-500">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </section>
           )}
        </aside>

        {/* Right Content */}
        <main className="flex-1 p-8 space-y-8">
           {/* Objective / Summary */}
          {(summary || (typeof summary === "string" && summary.length > 0)) && (
            <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
              <section>
                 <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-4 border-b-2 border-[#1e293b] pb-1 inline-block">
                  About Me
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify text-sm">
                  {typeof summary === "string" ? summary : ""}
                </p>
              </section>
            </AIBlurOverlay>
          )}

          {/* AI Placeholder Block - If content is pending generation */}
          {data.aiMetadata?.generated === false && (
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 my-6 flex items-center gap-4 animate-pulse">
                <div className="bg-blue-100 p-3 rounded-full">
                   <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                </div>
                <div>
                   <h4 className="font-bold text-blue-900">AI Enhancement in Progress</h4>
                   <p className="text-sm text-blue-700">Detailed professional content will be generated and placed here upon completion.</p>
                </div>
             </div>
          )}

          {/* Work Experience */}
          <section>
             <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-6 border-b-2 border-[#1e293b] pb-1 inline-block">
              Work Experience
            </h3>
            <div className="space-y-6">
              {experience.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No experience added yet.</p>
              ) : (
                experience.map((exp, idx) => (
                  <div 
                    key={idx} 
                    className="relative pl-0"
                    style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
                  >
                    <h4 className="font-bold text-lg text-[#1e293b]">{exp.jobTitle}</h4>
                    <p className="text-[#1e293b]/80 italic mb-1 text-sm font-semibold">
                      {exp.company} <span className="text-gray-400 font-normal not-italic mx-2">|</span> 
                      <span className="text-gray-500 font-normal not-italic">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                    </p>
                 
                     <AIBlurOverlay type="bullets" isGenerated={data.aiMetadata?.generated}>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700">
                         {(exp.achievements && exp.achievements.length > 0 ? exp.achievements : [exp.description]).filter(Boolean).map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-justify">
                              <span className="mt-1.5 w-1.5 h-1.5 bg-[#1e293b] shrink-0"></span>
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
          
           {/* Core Competencies (optional if space permits, as 'Research Experience' placeholder) */}
           {data.coreCompetencies && data.coreCompetencies.length > 0 && (
             <section>
               <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-4 border-b-2 border-[#1e293b] pb-1 inline-block">
                Key Highlights
              </h3>
               <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {data.coreCompetencies.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 bg-[#1e293b] shrink-0"></span>
                       <span>{item}</span>
                    </li>
                  ))}
               </ul>
             </section>
           )}

           {/* Volunteer - Added Section */}
           {volunteer.length > 0 && (
             <section>
               <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-6 border-b-2 border-[#1e293b] pb-1 inline-block">
                Volunteer & Community
              </h3>
               <div className="space-y-4">
                  {volunteer.map((vol, idx) => (
                    <div key={idx} className="relative">
                       <h4 className="font-bold text-lg text-[#1e293b]">{vol.role}</h4>
                       <p className="text-[#1e293b]/80 italic mb-1 text-sm font-semibold">{vol.organization}</p>
                       {vol.description && (
                         <p className="text-sm text-gray-700 mt-1 text-justify">{vol.description}</p>
                       )}
                    </div>
                  ))}
               </div>
             </section>
           )}
        </main>
      </div>
    </div>
  );
}
