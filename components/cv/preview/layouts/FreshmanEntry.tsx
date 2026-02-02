import { CVData } from "@/types/cv";
// import Image from "next/image"; // Disabled for PDF compatibility
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe, Cake, Award, GraduationCap, Briefcase, Star } from "lucide-react";

export function FreshmanEntryLayout({ data }: { data: CVData }) {
  if (!data) return null;
  const personalInfo = data.personalInfo || {};
  const summary = data.summary || "";
  
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const volunteer = data.volunteer || [];
  const coreCompetencies = data.coreCompetencies || [];

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
      {/* Top Banner Accent */}
      <div className="h-6 w-full bg-[#fef2f2]"></div>

      {/* Header Section */}
      <div className="px-12 pt-8 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-6xl font-black uppercase tracking-tight text-[#fb7185] leading-none mb-4">
              {personalInfo.firstName} <br />
              {personalInfo.lastName}
            </h1>
            <div className="h-1 w-full bg-[#fb7185]/20 mt-2"></div>
          </div>
          
          {personalInfo.photo && (
            <div className="ml-8 w-32 h-32 rounded-lg border-2 border-[#fb7185]/20 overflow-hidden shadow-sm shrink-0 relative">
              {/* Use standard img for PDF compatibility */}
              <img
                src={personalInfo.photo}
                alt={personalInfo.firstName}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex px-12 py-8 gap-12">
        {/* Left Column - Main Freshman Highlights */}
        <div className="flex-1 space-y-10">
          
          {/* About Me / Objective Statement */}
          {summary && (
            <section>
              <h3 className="text-xl font-black text-[#fb7185] uppercase mb-4 tracking-wider flex items-center gap-3">
                About Me
                <div className="flex-1 h-2 bg-[#fef2f2]"></div>
              </h3>
              <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
                <p className="text-slate-600 leading-relaxed text-justify text-sm">
                  {typeof summary === "string" ? summary : ""}
                </p>
              </AIBlurOverlay>
            </section>
          )}

          {/* Summary of Qualification / Core Competencies */}
          {coreCompetencies.length > 0 && (
            <section>
              <h3 className="text-xl font-black text-[#fb7185] uppercase mb-4 tracking-wider flex items-center gap-3">
                Summary of Qualification
                <div className="flex-1 h-2 bg-[#fef2f2]"></div>
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {coreCompetencies.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <span className="text-[#fb7185] mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Professional Skills / Hard Skills */}
          {skills.some(s => s.category === "Technical" || !s.category) && (
            <section>
              <h3 className="text-xl font-black text-[#fb7185] uppercase mb-4 tracking-wider flex items-center gap-3">
                Professional Skills
                <div className="flex-1 h-2 bg-[#fef2f2]"></div>
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {skills.filter(s => s.category === "Technical" || !s.category).slice(0, 10).map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[#fb7185] text-[10px]">■</span>
                    <p className="text-sm font-bold text-slate-800">{skill.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Volunteer / Associations style */}
          {volunteer.length > 0 && (
            <section>
              <h3 className="text-xl font-black text-[#fb7185] uppercase mb-4 tracking-wider flex items-center gap-3">
                Volunteer & Service
                <div className="flex-1 h-2 bg-[#fef2f2]"></div>
              </h3>
              <div className="space-y-4">
                {volunteer.map((vol, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-bold text-slate-800">{vol.role}</p>
                    <p className="text-[#fb7185] font-medium">{vol.organization}</p>
                    <p className="text-slate-500 mt-1">{vol.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Logistics & Education */}
        <div className="w-[32%] space-y-10">
          
          {/* Contact Section */}
          <section>
            <h3 className="text-xl font-black text-[#fb7185] uppercase mb-4 tracking-wider flex items-center gap-2">
              Contact
              <div className="flex-1 h-2 bg-[#fef2f2]"></div>
            </h3>
            <div className="space-y-3 text-sm">
              {personalInfo.city && (
                <div className="flex gap-2">
                  <span className="font-bold text-slate-900">Address:</span>
                  <span className="text-slate-600">{personalInfo.city}{personalInfo.country ? `, ${personalInfo.country}` : ""}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex gap-2">
                  <span className="font-bold text-slate-900">Phone:</span>
                  <span className="text-slate-600">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex gap-2">
                  <span className="font-bold text-slate-900">Email:</span>
                  <span className="text-slate-600 break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.dateOfBirth && (
                <div className="flex gap-2">
                  <span className="font-bold text-slate-900 whitespace-nowrap">Date of Birth:</span>
                  <span className="text-slate-600">{personalInfo.dateOfBirth}</span>
                </div>
              )}
            </div>
            <div className="h-px w-full bg-slate-200 mt-6"></div>
          </section>

          {/* Soft Skills Section */}
          {skills.some(s => s.category === "Soft") && (
            <section>
              <h3 className="text-xl font-black text-[#fb7185] uppercase mb-4 tracking-wider flex items-center gap-2">
                Skills
                <div className="flex-1 h-2 bg-[#fef2f2]"></div>
              </h3>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {skills.filter(s => s.category === "Soft").map((skill, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#fb7185]">•</span>
                    {skill.name}
                  </li>
                ))}
              </ul>
              <div className="h-px w-full bg-slate-200 mt-6"></div>
            </section>
          )}

          {/* Education - Crucial for Students */}
          {education.length > 0 && (
            <section>
              <h3 className="text-xl font-black text-[#fb7185] uppercase mb-4 tracking-wider flex items-center gap-2">
                Education
                <div className="flex-1 h-2 bg-[#fef2f2]"></div>
              </h3>
              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-bold text-slate-900 leading-snug">{edu.degree}</p>
                    <p className="text-slate-500 italic mt-0.5">{edu.school}</p>
                    <p className="text-[#fb7185] font-bold text-xs uppercase mt-2">
                      {edu.startDate} - {edu.endDate}
                    </p>
                    {edu.gpa && <p className="text-slate-600 mt-1 font-medium text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
              <div className="h-px w-full bg-slate-200 mt-6"></div>
            </section>
          )}

          {/* Work History - Secondary for Freshmen */}
          {experience.length > 0 && (
            <section>
              <h3 className="text-xl font-black text-[#fb7185] uppercase mb-4 tracking-wider flex items-center gap-2">
                Work History
                <div className="flex-1 h-2 bg-[#fef2f2]"></div>
              </h3>
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-bold text-slate-900 leading-snug">{exp.jobTitle}</p>
                    <p className="text-[#fb7185] text-xs font-bold uppercase mt-1">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </p>
                    <p className="text-slate-600 font-medium text-xs mt-1">{exp.company}</p>
                  </div>
                ))}
              </div>
              <div className="h-px w-full bg-slate-200 mt-6"></div>
            </section>
          )}

          {/* Languages Section */}
          {languages.length > 0 && (
            <section>
              <h3 className="text-xl font-black text-[#fb7185] uppercase mb-4 tracking-wider flex items-center gap-2">
                Languages
                <div className="flex-1 h-2 bg-[#fef2f2]"></div>
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-slate-800">{lang.language}</span>
                    <span className="text-[10px] text-slate-400">({lang.proficiency})</span>
                  </div>
                ))}
              </div>
            </section>
          )}
      </div>
    </div>
      
      {/* Footer Accent */}
      <div className="h-4 w-full bg-[#fef2f2] mt-auto"></div>
    </div>
  );
}
