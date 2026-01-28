import { CVData } from "@/types/cv";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";

export function ExecutiveMaroonLayout({ data }: { data: CVData }) {
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
      className="min-h-[297mm] w-full font-serif text-slate-800 bg-white flex flex-col"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* HEADER - Deep Burgundy */}
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
             
             {personalInfo.photo && (
                <div className="w-28 h-28 rounded-md border-2 border-[#fecaca] overflow-hidden shadow-lg shrink-0 ml-8">
                  <img
                    src={personalInfo.photo}
                    alt={personalInfo.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
             )}
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
                <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors truncate">LinkedIn</a>
              </div>
            )}
         </div>
      </div>

      <div className="flex-1 flex">
        
        {/* MAIN CONTENT (Left - Standard Executive) */}
        <div className="flex-1 p-12 pr-16 space-y-12">
           
           {/* Profile */}
           {summary && (
             <section>
               <h3 className="text-xl font-bold text-[#7f1d1d] uppercase mb-4 border-b border-[#7f1d1d] pb-2 flex items-center gap-2">
                 <span className="w-2 h-2 bg-[#7f1d1d]"></span>
                 Executive Profile
               </h3>
               <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
                  <p className="text-slate-700 leading-7 text-justify font-sans">
                    {typeof summary === "string" ? summary : ""}
                  </p>
               </AIBlurOverlay>
             </section>
           )}

           {/* Experience */}
           <section>
              <h3 className="text-xl font-bold text-[#7f1d1d] uppercase mb-6 border-b border-[#7f1d1d] pb-2 flex items-center gap-2">
                 <span className="w-2 h-2 bg-[#7f1d1d]"></span>
                 Professional Experience
              </h3>
              
              <div className="space-y-8 font-sans">
                 {experience.length === 0 ? (
                  <p className="text-slate-400 italic">No experience added yet.</p>
                ) : (
                  experience.map((exp, idx) => (
                    <div key={idx} style={{ pageBreakInside: "avoid" }}>
                       <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-lg text-slate-900">{exp.jobTitle}</h4>
                          <span className="text-sm font-semibold text-[#7f1d1d]">
                             {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                          </span>
                       </div>
                       <div className="text-slate-600 font-medium text-sm mb-3 italic">{exp.company} | {exp.location || "Remote"}</div>
                       
                       <AIBlurOverlay type="bullets" isGenerated={data.aiMetadata?.generated}>
                        <ul className="space-y-2 text-sm text-slate-700 leading-relaxed list-disc list-outside ml-4 marker:text-[#7f1d1d]">
                          {(exp.achievements && exp.achievements.length > 0 ? exp.achievements : [exp.description]).filter(Boolean).map((point, i) => (
                            <li key={i}>
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
           
           {/* Core Competencies (Moved to main for executive view) */}
           {coreCompetencies.length > 0 && (
             <section style={{ pageBreakInside: "avoid" }}>
               <h3 className="text-xl font-bold text-[#7f1d1d] uppercase mb-4 border-b border-[#7f1d1d] pb-2 flex items-center gap-2">
                 <span className="w-2 h-2 bg-[#7f1d1d]"></span>
                 Core Competencies
               </h3>
               <div className="grid grid-cols-2 gap-4 font-sans">
                  {coreCompetencies.map((comp, idx) => (
                       <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                          <GripVertical size={14} className="text-[#991b1b]" />
                          {comp}
                       </div>
                  ))}
               </div>
             </section>
           )}

        </div>

        {/* SIDEBAR (Right - Narrower, Gray) */}
        <div className="w-[28%] bg-slate-50 border-l border-slate-200 p-8 space-y-10 font-sans">
           
           {/* Education */}
           {education.length > 0 && (
             <section>
                <h3 className="text-lg font-bold text-[#7f1d1d] uppercase mb-4 pb-1 border-b border-slate-300">Education</h3>
                <div className="space-y-6">
                   {education.map((edu, idx) => (
                     <div key={idx}>
                        <div className="font-bold text-slate-900 text-sm leading-tight mb-1">{edu.degree}</div>
                        <div className="text-[#7f1d1d] text-xs font-bold uppercase mb-1">{edu.school}</div>
                        <div className="text-slate-500 text-xs italic">{edu.startDate} - {edu.endDate}</div>
                     </div>
                   ))}
                </div>
             </section>
           )}

           {/* Skills */}
           {skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-[#7f1d1d] uppercase mb-4 pb-1 border-b border-slate-300">Skills</h3>
              <div className="flex flex-wrap gap-2">
                 {skills.map((skill, idx) => (
                   <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {skill.name}
                   </span>
                 ))}
              </div>
            </section>
           )}

           {/* Languages */}
           {languages.length > 0 && (
             <section>
                <h3 className="text-lg font-bold text-[#7f1d1d] uppercase mb-4 pb-1 border-b border-slate-300">Languages</h3>
                <ul className="space-y-2">
                   {languages.map((lang, idx) => (
                     <li key={idx} className="text-sm">
                        <span className="font-medium text-slate-800 block">{lang.language}</span>
                        <span className="text-slate-500 text-xs">{lang.proficiency}</span>
                     </li>
                   ))}
                </ul>
             </section>
           )}
           
           {/* Volunteer (Sidebar for this layout) */}
           {volunteer.length > 0 && (
             <section>
               <h3 className="text-lg font-bold text-[#7f1d1d] uppercase mb-4 pb-1 border-b border-slate-300">Volunteering</h3>
               <div className="space-y-4">
                  {volunteer.map((vol, idx) => (
                       <div key={idx} className="text-sm">
                          <div className="font-bold text-slate-800">{vol.role}</div>
                          <div className="text-[#991b1b] text-xs mb-1">{vol.organization}</div>
                       </div>
                  ))}
               </div>
             </section>
           )}

        </div>

      </div>
    </div>
  );
}
