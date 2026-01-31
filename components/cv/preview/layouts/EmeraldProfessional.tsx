import { CVData } from "@/types/cv";
import Image from "next/image";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe, Hash, Cake } from "lucide-react";

export function EmeraldProfessionalLayout({ data }: { data: CVData }) {
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
      className="min-h-[297mm] w-full font-sans text-slate-800 bg-white flex flex-col"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* HEADER - Clean and Airy */}
      <div className="p-12 pb-8 border-b border-emerald-100">
         <div className="flex justify-between items-start">
             <div>
                <h1 className="text-5xl font-bold uppercase tracking-wide text-[#064e3b] mb-2 font-serif">
                  {personalInfo.firstName} <span className="font-light text-[#059669]">{personalInfo.lastName}</span>
                </h1>
                <p className="text-xl tracking-[0.2em] text-slate-500 uppercase font-medium mb-6">
                  {personalInfo.jobTitle}
                </p>
                
                {/* Contact Grid - Horizontal */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                    {personalInfo.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-[#059669]" />
                        <span>{personalInfo.phone}</span>
                      </div>
                    )}
                    {personalInfo.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-[#059669]" />
                        <span>{personalInfo.email}</span>
                      </div>
                    )}
                     {personalInfo.linkedin && (
                      <div className="flex items-center gap-2">
                        <Linkedin size={14} className="text-[#059669]" />
                        <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-[#059669] transition-colors">LinkedIn</a>
                      </div>
                    )}
                     {(personalInfo.city || personalInfo.country) && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#059669]" />
                        <span>
                          {personalInfo.city && personalInfo.country
                            ? `${personalInfo.city}, ${personalInfo.country}`
                            : personalInfo.city || personalInfo.country}
                        </span>
                      </div>
                    )}
                    {personalInfo.dateOfBirth && (
                      <div className="flex items-center gap-2">
                        <Cake size={14} className="text-[#059669]" />
                        <span>Date of Birth: {personalInfo.dateOfBirth}</span>
                      </div>
                    )}
                </div>
             </div>
             
             {/* Optional Photo */}
             {personalInfo.photo && (
                <div className="w-24 h-24 rounded-full border-2 border-emerald-100 p-1 shrink-0 ml-4 relative overflow-hidden">
                  <Image
                    src={personalInfo.photo}
                    alt={personalInfo.firstName}
                    fill
                    className="object-cover rounded-full"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
             )}
         </div>
      </div>

      <div className="flex-1 p-12 pt-8">
        
           {/* Profile */}
           {summary && (
             <section className="mb-10">
               <h3 className="text-sm font-bold text-[#059669] uppercase mb-3 tracking-widest border-b border-emerald-100 pb-1">About Me</h3>
               <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
                  <p className="text-slate-600 leading-relaxed text-justify">
                    {typeof summary === "string" ? summary : ""}
                  </p>
               </AIBlurOverlay>
             </section>
           )}
           
           {/* Main Grid Layout */}
           <div className="grid grid-cols-12 gap-10">
              
              {/* Left Column (Main Content) */}
              <div className="col-span-8 space-y-10">
                  
                   {/* Experience */}
                   <section>
                      <h3 className="text-sm font-bold text-[#059669] uppercase mb-6 tracking-widest border-b border-emerald-100 pb-1">Experience</h3>
                      
                      <div className="space-y-8">
                         {experience.length === 0 ? (
                          <p className="text-slate-400 italic">No experience added yet.</p>
                        ) : (
                          experience.map((exp, idx) => (
                            <div key={idx} style={{ pageBreakInside: "avoid" }}>
                               <div className="flex justify-between items-baseline mb-1">
                                  <h4 className="font-bold text-lg text-slate-800">{exp.jobTitle}</h4>
                               </div>
                               <div className="flex justify-between text-sm mb-3">
                                   <span className="font-medium text-[#047857]">{exp.company}</span>
                                   <span className="text-slate-500 italic">
                                     {exp.startDate} – {exp.current ? "Present" : exp.endDate} | {exp.location}
                                   </span>
                               </div>
                               
                               <AIBlurOverlay type="bullets" isGenerated={data.aiMetadata?.generated}>
                                <ul className="space-y-1.5 text-sm text-slate-600 leading-relaxed list-disc list-outside ml-4 marker:text-[#10b981]">
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

                   {/* Core Competencies (Main column for visibility) */}
                   {coreCompetencies.length > 0 && (
                     <section style={{ pageBreakInside: "avoid" }}>
                       <h3 className="text-sm font-bold text-[#059669] uppercase mb-4 tracking-widest border-b border-emerald-100 pb-1">Expertise</h3>
                       <div className="flex flex-wrap gap-2">
                          {coreCompetencies.map((comp, idx) => (
                               <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                  <Hash size={12} className="text-[#059669]" />
                                  {comp}
                               </div>
                          ))}
                       </div>
                     </section>
                   )}

              </div>

              {/* Right Column (Sidebar) */}
              <div className="col-span-4 space-y-10">
                  
                   {/* Education */}
                   {education.length > 0 && (
                     <section>
                        <h3 className="text-sm font-bold text-[#059669] uppercase mb-4 tracking-widest border-b border-emerald-100 pb-1">Education</h3>
                        <div className="space-y-6">
                           {education.map((edu, idx) => (
                             <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                                <div className="font-bold text-slate-800 text-sm leading-tight mb-1">{edu.degree}</div>
                                <div className="text-[#059669] text-xs font-bold uppercase mb-1">{edu.school}</div>
                                <div className="text-slate-500 text-xs italic">{edu.startDate} - {edu.endDate}</div>
                             </div>
                           ))}
                        </div>
                     </section>
                   )}

                   {/* Skills */}
                   {skills.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold text-[#059669] uppercase mb-4 tracking-widest border-b border-emerald-100 pb-1">Skills</h3>
                      <div className="space-y-2">
                         {skills.map((skill, idx) => (
                           <div key={idx} className="text-sm flex justify-between items-center border-b border-slate-100 pb-1 last:border-0">
                              <span className="text-slate-700 font-medium">{skill.name}</span>
                              {/* Simple dot indicator */}
                              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                           </div>
                         ))}
                      </div>
                    </section>
                   )}

                   {/* Languages */}
                   {languages.length > 0 && (
                     <section>
                        <h3 className="text-sm font-bold text-[#059669] uppercase mb-4 tracking-widest border-b border-emerald-100 pb-1">Languages</h3>
                        <ul className="space-y-2">
                           {languages.map((lang, idx) => (
                             <li key={idx} className="text-sm">
                                <span className="font-medium text-slate-800">{lang.language}</span>
                                <span className="text-slate-400 text-xs ml-2">({lang.proficiency})</span>
                             </li>
                           ))}
                        </ul>
                     </section>
                   )}

                   {/* Volunteer */}
                   {volunteer.length > 0 && (
                     <section>
                       <h3 className="text-sm font-bold text-[#059669] uppercase mb-4 tracking-widest border-b border-emerald-100 pb-1">Volunteering</h3>
                       <div className="space-y-4">
                          {volunteer.map((vol, idx) => (
                               <div key={idx} className="text-sm">
                                  <div className="font-bold text-slate-800">{vol.role}</div>
                                  <div className="text-[#059669] text-xs mb-1">{vol.organization}</div>
                               </div>
                          ))}
                       </div>
                     </section>
                   )}

              </div>
           </div>
      </div>
    </div>
  );
}
