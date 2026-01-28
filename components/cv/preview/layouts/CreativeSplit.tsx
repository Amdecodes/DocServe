import { CVData } from "@/types/cv";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function CreativeSplitLayout({ data }: { data: CVData }) {
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
      {/* HEADER - Split Design */}
      <div className="flex bg-[#312e81] text-white min-h-[160px]">
         {/* Left: Name and Title (Large) */}
         <div className="flex-1 p-10 flex flex-col justify-center bg-[#3730a3]">
            <h1 className="text-5xl font-black uppercase tracking-tight mb-2 leading-none">
              {personalInfo.firstName} <br /> {personalInfo.lastName}
            </h1>
            <p className="text-xl text-[#c7d2fe] tracking-widest font-medium uppercase mt-2">
              {personalInfo.jobTitle || "Professional Title"}
            </p>
         </div>
         
         {/* Right: Photo (if exists) or Icon */}
         <div className="w-[30%] bg-[#312e81] flex items-center justify-center relative overflow-hidden">
             {/* Decorative circle */}
             <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#4338ca] opacity-50"></div>
             
             {personalInfo.photo ? (
                <div className="w-32 h-32 rounded-full border-4 border-[#c7d2fe] overflow-hidden relative z-10 shadow-xl">
                  <img
                    src={personalInfo.photo}
                    alt={personalInfo.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
             ) : (
                 <div className="text-[#c7d2fe] opacity-20 text-9xl font-black select-none z-10">
                    {personalInfo.firstName?.[0]}
                 </div>
             )}
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
                <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-[#818cf8] transition-colors">LinkedIn</a>
              </div>
            )}
             {personalInfo.website && (
               <div className="flex items-center gap-2">
                <Globe size={14} className="text-[#818cf8]" />
                <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:text-[#818cf8] transition-colors">Portfolio</a>
              </div>
            )}
       </div>


      <div className="flex-1 flex">
        
        {/* MAIN CONTENT (Left) */}
        <div className="flex-1 p-10 pt-12 space-y-10">
           
           {/* Summary */}
           {summary && (
             <section>
               <h3 className="text-2xl font-black text-[#312e81] uppercase mb-4 pb-2 border-b-2 border-[#312e81]">About Me</h3>
               <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
                  <p className="text-slate-600 leading-relaxed text-justify">
                    {typeof summary === "string" ? summary : ""}
                  </p>
               </AIBlurOverlay>
             </section>
           )}

           {/* Experience */}
           <section>
              <h3 className="text-2xl font-black text-[#312e81] uppercase mb-6 pb-2 border-b-2 border-[#312e81]">Experience</h3>
              
              <div className="space-y-8">
                 {experience.length === 0 ? (
                  <p className="text-slate-400 italic">No experience added yet.</p>
                ) : (
                  experience.map((exp, idx) => (
                    <div key={idx} className="group" style={{ pageBreakInside: "avoid" }}>
                       <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-lg text-slate-800">{exp.jobTitle}</h4>
                          <span className="text-xs font-bold text-[#4338ca] bg-[#e0e7ff] px-2 py-1 rounded">
                             {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                          </span>
                       </div>
                       <div className="text-[#4338ca] font-medium text-sm mb-3">{exp.company} | {exp.location || "Remote"}</div>
                       
                       <AIBlurOverlay type="bullets" isGenerated={data.aiMetadata?.generated}>
                        <ul className="space-y-1.5 text-sm text-slate-600 leading-relaxed list-disc list-outside ml-4 marker:text-[#4338ca]">
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

           {/* Projects / Volunteering (if standard structure, putting Vol here) */}
           {volunteer.length > 0 && (
             <section style={{ pageBreakInside: "avoid" }}>
               <h3 className="text-2xl font-black text-[#312e81] uppercase mb-6 pb-2 border-b-2 border-[#312e81]">Impact & Volunteering</h3>
               <div className="grid grid-cols-1 gap-6">
                  {volunteer.map((vol, idx) => (
                       <div key={idx} className="bg-slate-50 p-5 rounded-r-xl border-l-4 border-[#4338ca]">
                          <div className="flex justify-between font-bold text-slate-800 mb-1">
                             <span>{vol.role}</span>
                          </div>
                          <div className="text-[#4f46e5] text-sm font-medium mb-2">{vol.organization}</div>
                          <p className="text-sm text-slate-600 italic">{vol.description}</p>
                       </div>
                  ))}
               </div>
             </section>
           )}

        </div>

        {/* SIDEBAR (Right) */}
        <div className="w-[30%] bg-[#f5f3ff] p-8 pt-12 space-y-10 border-l border-indigo-100">
           
           {/* Core Competencies */}
           {coreCompetencies.length > 0 && (
             <section>
               <h3 className="text-lg font-bold text-[#312e81] uppercase mb-4 tracking-wider">Expertise</h3>
               <div className="flex flex-wrap gap-2">
                  {coreCompetencies.map((comp, idx) => (
                       <span key={idx} className="text-sm bg-white text-[#312e81] px-3 py-1.5 shadow-sm rounded-md font-medium border border-indigo-50">
                          {comp}
                       </span>
                  ))}
               </div>
             </section>
           )}

           {/* Skills */}
           {skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-[#312e81] uppercase mb-4 tracking-wider">Skills</h3>
              <ul className="space-y-2">
                 {skills.map((skill, idx) => (
                   <li key={idx} className="bg-[#4338ca] text-white px-3 py-1.5 rounded text-sm text-center font-medium shadow-sm">
                      {skill.name}
                   </li>
                 ))}
              </ul>
            </section>
           )}

           {/* Education */}
           {education.length > 0 && (
             <section>
                <h3 className="text-lg font-bold text-[#312e81] uppercase mb-4 tracking-wider">Education</h3>
                <div className="space-y-6">
                   {education.map((edu, idx) => (
                     <div key={idx} className="border-b border-indigo-200 pb-4 last:border-0 last:pb-0">
                        <div className="font-bold text-slate-800 text-sm leading-tight mb-1">{edu.degree}</div>
                        <div className="text-[#4f46e5] text-xs font-bold uppercase mb-1">{edu.school}</div>
                        <div className="text-slate-500 text-xs italic">{edu.startDate} - {edu.endDate}</div>
                     </div>
                   ))}
                </div>
             </section>
           )}

           {/* Languages */}
           {languages.length > 0 && (
             <section>
                <h3 className="text-lg font-bold text-[#312e81] uppercase mb-4 tracking-wider">Languages</h3>
                <ul className="space-y-3">
                   {languages.map((lang, idx) => (
                     <li key={idx} className="flex justify-between items-center text-sm border-b border-indigo-100 pb-1">
                        <span className="font-medium text-slate-700">{lang.language}</span>
                        <span className="text-[#4338ca] text-xs font-bold">{lang.proficiency}</span>
                     </li>
                   ))}
                </ul>
             </section>
           )}

        </div>

      </div>
    </div>
  );
}
