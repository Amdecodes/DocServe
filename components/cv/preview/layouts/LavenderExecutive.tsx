import { CVData } from "@/types/cv";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export function LavenderExecutiveLayout({ data }: { data: CVData }) {
  if (!data) return null;
  const personalInfo = data.personalInfo || {};
  const summary = data.summary || "";
  
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const coreCompetencies = data.coreCompetencies || [];

  const formatUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
    <div className="min-h-[297mm] w-full font-sans text-gray-800 bg-white p-12">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-violet-600 mb-4">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-600">
          {personalInfo.city && personalInfo.country && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{personalInfo.city}, {personalInfo.country}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <a href={formatUrl(personalInfo.website)} className="hover:text-violet-600">
                {personalInfo.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Summary Section */}
      {summary && (
        <section className="mb-8">
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-violet-600 mb-3">
              Summary
            </h3>
            <AIBlurOverlay type="summary" isGenerated={data.aiMetadata?.generated}>
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                {summary}
              </p>
            </AIBlurOverlay>
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-violet-600 mb-4">
              Work Experience
            </h3>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900">
                      {exp.jobTitle} <span className="text-gray-400 font-normal mx-1">,</span> {exp.company}
                    </h4>
                    <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <AIBlurOverlay type="bullets" isGenerated={data.aiMetadata?.generated}>
                    <ul className="list-disc list-outside ml-4 mt-2 space-y-1.5 text-sm text-gray-700">
                      {(exp.achievements && exp.achievements.length > 0 ? exp.achievements : [exp.description]).filter(Boolean).map((point, i) => (
                        <li key={i} className="pl-1 leading-relaxed">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </AIBlurOverlay>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section className="mb-8">
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-violet-600 mb-4">
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                    <span className="text-sm font-semibold text-gray-600">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{edu.school}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Information / Skills Section */}
      {(skills.length > 0 || languages.length > 0 || coreCompetencies.length > 0) && (
        <section className="mb-8">
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-violet-600 mb-4">
              Additional Information
            </h3>
            <div className="space-y-3 text-sm">
              {skills.length > 0 && (
                <div className="flex gap-2">
                  <span className="font-bold text-gray-900 shrink-0">Technical Skills:</span>
                  <span className="text-gray-700">{skills.map(s => s.name).join(", ")}</span>
                </div>
              )}
              {languages.length > 0 && (
                <div className="flex gap-2">
                  <span className="font-bold text-gray-900 shrink-0">Languages:</span>
                  <span className="text-gray-700">
                    {languages.map(l => `${l.language} (${l.proficiency})`).join(", ")}
                  </span>
                </div>
              )}
              {coreCompetencies.length > 0 && (
                <div className="flex gap-2">
                  <span className="font-bold text-gray-900 shrink-0">Core Competencies:</span>
                  <span className="text-gray-700">{coreCompetencies.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
