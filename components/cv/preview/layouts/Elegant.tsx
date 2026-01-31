import { CVData } from "@/types/cv";
import Image from "next/image";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, User, Cake } from "lucide-react";

export function ElegantLayout({ data }: { data: CVData }) {
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
      className="min-h-[297mm] w-full font-sans text-[#1f1f1f] bg-white flex flex-col"
    >
      <div 
        className="flex flex-1"
        style={{
          // Simple visual separator line logic if strictly CSS, but for robust PDF background we rely on container color.
          // The image shows white background with a line. 
          // We can achieve the "infinite vertical line" by border-r on the sidebar.
          // Since both sides are white, we don't need a gradient background for color, just the border.
          background: "white",
          minHeight: "100%",
          display: "flex"
        }}
      >
        {/* Left Sidebar - Width ~35% */}
        <aside className="w-[35%] py-12 pl-10 pr-8 border-r border-gray-300 flex flex-col gap-10">
          
          {/* Photo */}
          {personalInfo.photo && (
            <div className="flex justify-center mb-2">
              <div className="w-48 h-48 rounded-full border-4 border-gray-100 shadow-sm relative overflow-hidden">
                  <Image
                    src={personalInfo.photo}
                    alt={personalInfo.firstName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
              </div>
            </div>
          )}

          {/* Contact */}
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider text-[#3e3430] mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
              {personalInfo.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-500 shrink-0" />
                  <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:text-[#3e3430] underline decoration-dotted">Portfolio</a>
                </div>
              )}
               {personalInfo.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-gray-500 shrink-0" />
                  <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:text-[#3e3430] underline decoration-dotted">LinkedIn</a>
                </div>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="leading-tight">
                    {personalInfo.city && personalInfo.country
                      ? `${personalInfo.city}, ${personalInfo.country}`
                      : personalInfo.city || personalInfo.country}
                  </span>
                </div>
              )}
              {personalInfo.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Cake className="w-4 h-4 text-gray-500 shrink-0" /> 
                  <span>Date of Birth: {personalInfo.dateOfBirth}</span>
                </div>
              )}
            </div>
          </section>

          {/* Education */}
          {education.length > 0 && (
            <section style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
              <h3 className="text-lg font-bold uppercase tracking-wider text-[#3e3430] mb-4">
                Education
              </h3>
              <div className="space-y-5">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-bold text-gray-900">{edu.degree}</p>
                    <p className="text-gray-600 italic">{edu.school}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
              <h3 className="text-lg font-bold uppercase tracking-wider text-[#3e3430] mb-4">
                Skills
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {skills.map((skill, idx) => (
                  <li key={idx}>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

           {/* Languages */}
           {languages.length > 0 && (
            <section style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
              <h3 className="text-lg font-bold uppercase tracking-wider text-[#3e3430] mb-4">
                Languages
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {languages.map((lang, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-gray-500 text-xs pt-0.5">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Right Content - Width ~65% */}
        <main className="w-[65%] py-12 px-10 flex flex-col gap-8">
          
          {/* Header */}
          <header>
            <h1 className="text-5xl font-serif text-[#2d2424] mb-2 leading-none">
              {personalInfo.firstName} <br />
              {personalInfo.lastName}
            </h1>
            <p className="text-xl text-gray-600 font-light mt-4">
              {personalInfo.jobTitle}
            </p>
             {(personalInfo.headline) && (
              <p className="text-sm text-gray-500 mt-2 italic">
                {personalInfo.headline}
              </p>
            )}
          </header>

          {/* Objective / Summary */}
          {(summary || (typeof summary === "string" && summary.length > 0)) && (
            <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
              <section>
                <h3 className="text-lg font-bold uppercase tracking-wider text-[#3e3430] mb-3">
                  About Me
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed text-justify">
                  {typeof summary === "string" ? summary : ""}
                </p>
              </section>
            </AIBlurOverlay>
          )}

           {/* AI Placeholder */}
           {data.aiMetadata?.generated === false && (
             <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center gap-4 animate-pulse">
                <div className="bg-gray-200 p-2 rounded-full">
                   {/* Simple icon placeholder */}
                   <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                   <h4 className="font-bold text-gray-700 text-sm">AI Content Pending</h4>
                   <p className="text-xs text-gray-500">Your professional summary and experience details are being generated.</p>
                </div>
             </div>
          )}

          {/* Work Experience */}
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider text-[#3e3430] mb-6">
              Work Experience
            </h3>
            <div className="space-y-8">
              {experience.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No experience added yet.</p>
              ) : (
                experience.map((exp, idx) => (
                  <div key={idx} className="relative break-inside-avoid" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-gray-900 text-base">{exp.jobTitle}</h4>
                      <span className="text-xs text-gray-500 font-medium shrink-0">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline mb-3">
                       <p className="text-gray-700 font-semibold text-sm">{exp.company}</p>
                       {exp.location && <span className="text-xs text-gray-400">{exp.location}</span>}
                    </div>
                    
                    <AIBlurOverlay type="bullets" isGenerated={data.aiMetadata?.generated}>
                      <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-600 leading-relaxed">
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

          {/* Volunteer / References style section */}
          {volunteer.length > 0 && (
             <section style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
               <h3 className="text-lg font-bold uppercase tracking-wider text-[#3e3430] mb-4">
                Volunteering & Leadership
              </h3>
               <div className="grid grid-cols-1 gap-6">
                  {volunteer.map((vol, idx) => (
                    <div key={idx}>
                       <h4 className="font-bold text-gray-800 text-sm">{vol.organization}</h4>
                       <p className="text-xs text-gray-500 mb-1">{vol.role}</p>
                       <p className="text-sm text-gray-600">{vol.description}</p>
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
