import { CVData } from "@/types/cv";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe, Cake } from "lucide-react";

export function MinimalistTealLayout({ data }: { data: CVData }) {
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
      className="min-h-[297mm] w-full font-sans text-slate-700 bg-white flex flex-col"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact"
      }}
    >
      {/* HEADER */}
      <div className="bg-[#f0fdfa] border-b-4 border-[#0d9488] p-10 pb-8 text-center">
        {/* Photo (Optional, centered) */}
        {personalInfo.photo && (
          <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-white shadow-md overflow-hidden">
            <img
              src={personalInfo.photo}
              alt={personalInfo.firstName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h1 className="text-5xl font-bold uppercase tracking-widest text-[#0f766e] mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl uppercase tracking-[0.3em] text-[#0d9488] font-light mb-6">
          {personalInfo.jobTitle}
        </p>

        {/* Contact Info - Centered Row */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                 <Phone size={14} className="text-[#0d9488]" />
                 <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#0d9488]" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
               <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#0d9488]" />
                <span>
                  {personalInfo.city && personalInfo.country
                    ? `${personalInfo.city}, ${personalInfo.country}`
                    : personalInfo.city || personalInfo.country}
                </span>
              </div>
            )}
            {personalInfo.dateOfBirth && (
              <div className="flex items-center gap-2">
                <Cake size={14} className="text-[#0d9488]" />
                <span>Date of Birth: {personalInfo.dateOfBirth}</span>
              </div>
            )}
             {personalInfo.linkedin && (
               <div className="flex items-center gap-2">
                <Linkedin size={14} className="text-[#0d9488]" />
                <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-[#0d9488] transition-colors">LinkedIn</a>
              </div>
            )}
             {personalInfo.website && (
               <div className="flex items-center gap-2">
                <Globe size={14} className="text-[#0d9488]" />
                <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:text-[#0d9488] transition-colors">Portfolio</a>
              </div>
            )}
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 grid grid-cols-12">
        
        {/* LEFT COLUMN (Sidebar-like but white) */}
        <div className="col-span-4 bg-[#fcfcfc] border-r border-slate-100 p-8 pt-10 space-y-10">
          
          {/* Education */}
          {education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest text-[#0f766e] border-b-2 border-[#0d9488] pb-1 mb-4">
                Education
              </h3>
              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-slate-800 text-sm">{edu.degree}</p>
                    <p className="text-sm text-[#0d9488] font-medium">{edu.school}</p>
                    <p className="text-xs text-slate-500 mt-1">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
             <section>
              <h3 className="text-lg font-bold uppercase tracking-widest text-[#0f766e] border-b-2 border-[#0d9488] pb-1 mb-4">
                Languages
              </h3>
              <ul className="space-y-3 text-sm">
                {languages.map((lang, idx) => (
                  <li key={idx}>
                    <div className="flex justify-between mb-1">
                       <span className="font-medium text-slate-700">{lang.language}</span>
                       <span className="text-slate-500 text-xs">{lang.proficiency}</span>
                    </div>
                    {/* Visual bar */}
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-[#0d9488] w-3/4"></div> 
                       {/* Note: In real app, map proficiency to width % */}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

           {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest text-[#0f766e] border-b-2 border-[#0d9488] pb-1 mb-4">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-[#0d9488] text-[#0d9488] rounded-md text-xs font-medium">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN (Main Info) */}
        <div className="col-span-8 p-10 pt-10 space-y-10">
          
          {/* Profile */}
          {summary && (
             <section>
               <h3 className="text-xl font-bold uppercase tracking-widest text-[#0f766e] mb-4 flex items-center gap-3">
                 <span className="p-2 bg-[#0d9488] text-white rounded-md">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                 </span>
                 About Me
               </h3>
               <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
                  <p className="text-sm text-slate-600 leading-7 text-justify">
                    {typeof summary === "string" ? summary : ""}
                  </p>
               </AIBlurOverlay>
             </section>
          )}

          {/* Experience */}
          <section>
             <h3 className="text-xl font-bold uppercase tracking-widest text-[#0f766e] mb-6 flex items-center gap-3">
                 <span className="p-2 bg-[#0d9488] text-white rounded-md">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                 </span>
                 Experience
             </h3>
             
             <div className="space-y-8">
               {experience.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No experience added yet.</p>
                ) : (
                  experience.map((exp, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-slate-200" style={{ pageBreakInside: "avoid" }}>
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-4 border-[#0d9488] rounded-full"></div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                        <h4 className="font-bold text-lg text-slate-800">{exp.jobTitle}</h4>
                        <span className="text-xs font-bold text-[#0f766e] bg-[#f0fdfa] px-2 py-1 rounded-full whitespace-nowrap">
                            {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3 font-medium">{exp.company} | {exp.location || "Remote"}</p>
                      
                      <AIBlurOverlay type="bullets" isGenerated={data.aiMetadata?.generated}>
                        <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc list-outside ml-4 marker:text-[#0d9488]">
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

          {/* Core Competencies */}
          {coreCompetencies.length > 0 && (
             <section style={{ pageBreakInside: "avoid" }}>
                <h3 className="text-xl font-bold uppercase tracking-widest text-[#0f766e] mb-4 flex items-center gap-3">
                 <span className="p-2 bg-[#0d9488] text-white rounded-md">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 </span>
                 Highlights
               </h3>
               <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                  {coreCompetencies.map((comp, idx) => (
                       <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <svg className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          <span>{comp}</span>
                       </div>
                  ))}
               </div>
             </section>
          )}

           {/* Volunteer */}
           {volunteer.length > 0 && (
            <section style={{ pageBreakInside: "avoid" }}>
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#0f766e] mb-4 flex items-center gap-3">
                 <span className="p-2 bg-[#0d9488] text-white rounded-md">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                 </span>
                 Volunteering
               </h3>
               <div className="space-y-4">
                  {volunteer.map((vol, idx) => (
                       <div key={idx} className="text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <div className="font-bold text-slate-800 text-base mb-1">{vol.role}</div>
                          <div className="text-[#0d9488] font-medium mb-1">{vol.organization}</div>
                          <p className="text-slate-600 leading-relaxed">{vol.description}</p>
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
