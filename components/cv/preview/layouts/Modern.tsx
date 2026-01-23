import { CVData } from "@/types/cv";
import { AIBlurOverlay } from "@/components/ui/AIBlurOverlay";

export function ModernLayout({ data }: { data: CVData }) {
  if (!data) return null;
  const personalInfo = data.personalInfo || {};
  const summary = data.summary || "";

  const formatUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const volunteer = data.volunteer || [];
  const coreCompetencies = data.coreCompetencies || [];

  return (
    <div className="h-full w-full p-10 font-sans text-gray-800">
      {/* Header */}
      <header className="border-b-4 border-teal-600 pb-6 mb-8 flex justify-between items-start">
        <div className="flex items-center gap-6">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt={personalInfo.firstName}
              className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
            />
          )}
          <div>
            <h1 className="text-5xl font-bold uppercase tracking-tight text-gray-900 leading-none">
              {personalInfo.firstName || "Your"}{" "}
              <span className="text-teal-600">
                {personalInfo.lastName || "Name"}
              </span>
            </h1>
            <p className="text-2xl mt-2 text-gray-600 font-light">
              {personalInfo.headline || personalInfo.jobTitle || "Job Title"}
            </p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500 space-y-1 self-center">
          <p>{personalInfo.email || "email@example.com"}</p>
          <p>{personalInfo.phone || "+251 900 000 000"}</p>
          <p>
            {personalInfo.city && personalInfo.country
              ? `${personalInfo.city}, ${personalInfo.country}`
              : "Addis Ababa, Ethiopia"}
          </p>
          {personalInfo.linkedin && (
            <p>
              <a
                href={formatUrl(personalInfo.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline"
              >
                LinkedIn
              </a>
            </p>
          )}
          {personalInfo.website && (
            <p>
              <a
                href={formatUrl(personalInfo.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline"
              >
                Portfolio
              </a>
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Summary */}
        {(summary || (typeof summary === "string" && summary.length > 0)) && (
          <AIBlurOverlay
            type="summary"
            isGenerated={data.aiMetadata?.generated}
          >
            <section>
              <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">
                Profile
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {typeof summary === "string" ? summary : ""}
              </p>
            </section>
          </AIBlurOverlay>
        )}

        {/* Core Competencies / Highlights */}
        {coreCompetencies.length > 0 && (
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">
              Key Highlights
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {coreCompetencies.map((item, idx) => (
                <li key={idx}>
                  <strong>{item}</strong>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Experience */}
        <section>
          <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">
            Experience
          </h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg">{exp.jobTitle}</h4>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-teal-600 font-medium text-sm mb-2">
                  {exp.company}
                </p>
                {/* Achievements */}
                {exp.achievements && exp.achievements.length > 0 ? (
                  <AIBlurOverlay
                    type="bullets"
                    isGenerated={data.aiMetadata?.generated}
                  >
                    <div className="mt-2">
                      <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                        Achievements
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {exp.achievements.map((ach, i) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  </AIBlurOverlay>
                ) : (
                  exp.description && (
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )
                )}
              </div>
            ))}
            {experience.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No experience added yet.
              </p>
            )}
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">
            Education
          </h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg">{edu.school}</h4>
                  <span className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-teal-600 font-medium text-sm">
                  {edu.degree}
                </p>
                {edu.city && (
                  <p className="text-xs text-gray-500">{edu.city}</p>
                )}
              </div>
            ))}
            {education.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No education added yet.
              </p>
            )}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">
            Skills
          </h3>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No skills added yet.</p>
          )}
        </section>

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">
              Languages
            </h3>
            <div className="flex flex-wrap gap-4">
              {languages.map((lang) => (
                <div
                  key={lang.id}
                  className="flex flex-col bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"
                >
                  <span className="font-bold text-gray-800">
                    {lang.language}
                  </span>
                  <span className="text-gray-500 text-xs uppercase tracking-wide">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Volunteer */}
        {volunteer.length > 0 && (
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">
              Volunteering
            </h3>
            <div className="space-y-4">
              {volunteer.map((vol) => (
                <div key={vol.id}>
                  <h4 className="font-bold text-lg">{vol.role}</h4>
                  <p className="text-teal-600 font-medium text-sm">
                    {vol.organization}
                  </p>
                  {vol.description && (
                    <p className="text-sm text-gray-700 mt-1">
                      {vol.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
