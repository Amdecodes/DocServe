import { CVData } from "@/types/cv";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  User,
  Briefcase,
  GraduationCap,
} from "lucide-react";

export function ProfessionalLayout({ data }: { data: CVData }) {
  if (!data) return null;
  const { personalInfo, summary } = data;
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];

  return (
    <div className="h-full w-full bg-white flex flex-col font-sans text-gray-800">
      {/* Top Header Background */}
      <div className="h-40 bg-[#2c3e50] w-full relative print:bg-[#2c3e50] print:h-40">
        <div className="absolute top-12 left-[35%] right-8 text-white">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-lg tracking-widest uppercase font-light text-gray-300">
            {personalInfo.jobTitle}
          </p>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-[32%] bg-[#e5e7eb] pt-24 pb-8 px-6 flex flex-col gap-10 print:bg-[#e5e7eb]">
          {/* Profile Photo - Overlapping */}
          <div className="absolute top-16 left-12 w-40 h-40 rounded-full border-[6px] border-[#e5e7eb] overflow-hidden z-10 bg-gray-300">
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white text-4xl font-bold">
                {personalInfo.firstName?.[0]}
              </div>
            )}
          </div>

          {/* Contact */}
          <section>
            <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-400 pb-2 mb-4 text-[#2c3e50]">
              Contact
            </h3>
            <div className="flex flex-col gap-4 text-sm font-medium text-gray-700">
              <div className="flex items-center gap-3">
                <div className="min-w-6 flex justify-center">
                  <Phone size={16} fill="black" />
                </div>
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="min-w-6 flex justify-center">
                  <Mail size={16} fill="black" />
                </div>
                <span className="break-all">{personalInfo.email}</span>
              </div>
              {(personalInfo.city || personalInfo.country) && (
                <div className="flex items-center gap-3">
                  <div className="min-w-6 flex justify-center">
                    <MapPin size={16} fill="black" />
                  </div>
                  <span>
                    {personalInfo.city}, {personalInfo.country}
                  </span>
                </div>
              )}
              {(personalInfo.website || personalInfo.linkedin) && (
                <div className="flex items-center gap-3">
                  <div className="min-w-6 flex justify-center">
                    <Globe size={16} />
                  </div>
                  <span className="line-clamp-1">
                    {personalInfo.website || personalInfo.linkedin}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-400 pb-2 mb-4 text-[#2c3e50]">
                Skills
              </h3>
              <ul className="list-disc list-outside ml-4 space-y-2 text-sm font-medium text-gray-700 marker:text-[#2c3e50]">
                {skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-400 pb-2 mb-4 text-[#2c3e50]">
                Languages
              </h3>
              <ul className="list-disc list-outside ml-4 space-y-2 text-sm font-medium text-gray-700 marker:text-[#2c3e50]">
                {languages.map((l) => (
                  <li key={l.id}>
                    {l.language}{" "}
                    <span className="text-gray-500 font-normal">
                      ({l.proficiency})
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Main Content */}
        <div className="w-[68%] bg-white pt-8 pb-8 px-10 flex flex-col gap-8">
          {/* Profile / Summary */}
          {summary && (
            <section className="relative pl-8 border-l-2 border-gray-300">
              <div className="absolute -left-5.25 top-0 bg-[#2c3e50] text-white rounded-full p-2">
                <User size={20} />
              </div>
              <div className="mb-2">
                <h3 className="text-lg font-bold uppercase tracking-widest text-[#2c3e50]">
                  Profile
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 text-justify">
                {summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <section className="relative pl-8 border-l-2 border-gray-300">
              <div className="absolute -left-5.25 top-0 bg-[#2c3e50] text-white rounded-full p-2">
                <Briefcase size={20} />
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold uppercase tracking-widest text-[#2c3e50]">
                  Work Experience
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    {/* Dot on timeline */}
                    <div className="absolute -left-9.75 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#2c3e50]"></div>

                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-base text-gray-800">
                        {exp.company}
                      </h4>
                      <span className="text-xs font-bold text-gray-500">
                        {exp.startDate} -{" "}
                        {exp.current ? "PRESENT" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-600 italic mb-2">
                      {exp.jobTitle}
                    </div>

                    {exp.achievements.length > 0 ? (
                      <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1 marker:text-gray-400">
                        {exp.achievements.map((ach, i) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="relative pl-8 border-l-2 border-gray-300">
              <div className="absolute -left-5.25 top-0 bg-[#2c3e50] text-white rounded-full p-2">
                <GraduationCap size={20} />
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold uppercase tracking-widest text-[#2c3e50]">
                  Education
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                {education.map((edu) => (
                  <div key={edu.id} className="relative">
                    {/* Dot on timeline */}
                    <div className="absolute -left-9.75 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#2c3e50]"></div>

                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-base text-gray-800">
                        {edu.degree}
                      </h4>
                      <span className="text-xs font-bold text-gray-500">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-600 italic">
                      {edu.school}, {edu.city}
                    </div>
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
