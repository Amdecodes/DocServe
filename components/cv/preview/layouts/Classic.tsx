import { CVData } from "@/components/cv/CVContext"

export function ClassicLayout({ data }: { data: CVData }) {
  const { personalInfo, summary } = data

  return (
    <div className="h-full w-full p-12 font-serif text-gray-900">
       <div className="text-center border-b border-black pb-6 mb-8">
            <h1 className="text-4xl font-bold mb-2">{personalInfo.firstName || "Your"} {personalInfo.lastName || "Name"}</h1>
             <p className="text-lg italic mb-2">{personalInfo.jobTitle || "Job Title"}</p>
             <div className="flex justify-center gap-4 text-sm">
                 <span>{personalInfo.email || "email@example.com"}</span>
                 <span>|</span>
                 <span>{personalInfo.phone || "+251 900 000 000"}</span>
                 <span>|</span>
                 <span>{personalInfo.city && personalInfo.country ? `${personalInfo.city}, ${personalInfo.country}` : "Addis Ababa, Ethiopia"}</span>
             </div>
       </div>

        <div className="space-y-6">
             <section>
                <h3 className="font-bold border-b border-gray-300 mb-3 uppercase text-sm">Professional Summary</h3>
                <p className="text-sm leading-relaxed">
                     {typeof summary === 'string' && summary ? summary : "Professional summary goes here."}
                </p>
             </section>

             <section>
                <h3 className="font-bold border-b border-gray-300 mb-3 uppercase text-sm">Work Experience</h3>
                <div className="space-y-4">
                    {data.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between font-bold text-sm">
                                <span>{exp.jobTitle}</span>
                                <span>{exp.startDate} - {exp.endDate || "Present"}</span>
                            </div>
                             <p className="italic text-sm mb-1">{exp.company}</p>
                             {exp.description && <p className="text-sm whitespace-pre-line">{exp.description}</p>}
                        </div>
                    ))}
                </div>
             </section>

             <section>
                <h3 className="font-bold border-b border-gray-300 mb-3 uppercase text-sm">Education</h3>
                <div className="space-y-4">
                    {data.education.map((edu) => (
                        <div key={edu.id} className="mb-4">
                             <div className="flex justify-between font-bold text-sm">
                                <span>{edu.school}</span>
                                <span>{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <p className="italic text-sm">{edu.degree}, {edu.city}</p>
                        </div>
                    ))}
                </div>
             </section>

             <section>
                 <h3 className="font-bold border-b border-gray-300 mb-3 uppercase text-sm">Skills</h3>
                 <div className="text-sm">
                     {data.skills.map(s => s.name).join(", ")}
                 </div>
             </section>
        </div>
    </div>
  )
}
