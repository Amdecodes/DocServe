import { CVData } from "@/types/cv";
import { Cake } from "lucide-react";

export function ClassicLayout({ data }: { data: CVData }) {
  if (!data) return null;
  const { personalInfo, summary } = data;
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];

  return (
    <div className="h-full w-full p-12 font-serif text-gray-900 leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-4xl font-bold mb-3 uppercase tracking-widest">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg italic text-gray-600 mb-2">
          {personalInfo.jobTitle}
        </p>
        <div className="flex justify-center gap-3 text-sm text-gray-600">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>
            {personalInfo.city && personalInfo.country
              ? `${personalInfo.city}, ${personalInfo.country}`
              : personalInfo.city || personalInfo.country}
          </span>
          {personalInfo.dateOfBirth && (
            <>
              <span>•</span>
              <span><Cake size={12} className="inline mr-1" />Date of Birth: {personalInfo.dateOfBirth}</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary */}
        {summary && (
          <section>
            <h3 className="font-bold text-gray-800 border-b border-gray-300 mb-2 uppercase text-sm tracking-wider">
              About Me
            </h3>
            <p className="text-sm text-justify">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h3 className="font-bold text-gray-800 border-b border-gray-300 mb-3 uppercase text-sm tracking-wider">
              Work Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold text-sm mb-1">
                    <span>{exp.jobTitle}</span>
                    <span>
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm italic text-gray-700 mb-1">
                    {exp.company}
                  </div>

                  {exp.achievements && exp.achievements.length > 0 ? (
                    <ul className="list-disc list-inside text-sm pl-2">
                      {exp.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h3 className="font-bold text-gray-800 border-b border-gray-300 mb-3 uppercase text-sm tracking-wider">
              Education
            </h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between font-bold text-sm">
                    <span>
                      {edu.school}, {edu.city}
                    </span>
                    <span>
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="text-sm">{edu.degree}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3 className="font-bold text-gray-800 border-b border-gray-300 mb-3 uppercase text-sm tracking-wider">
              Skills
            </h3>
            <div className="text-sm flex flex-wrap gap-x-6 gap-y-2">
              {skills.map((s) => (
                <span key={s.id}>• {s.name}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
