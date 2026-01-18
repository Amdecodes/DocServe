import { CVData } from "@/components/cv/CVContext"

export function ModernLayout({ data }: { data: CVData }) {
  const { personalInfo, summary } = data

  return (
    <div className="h-full w-full p-10 font-sans text-gray-800">
      {/* Header */}
      <header className="border-b-4 border-teal-600 pb-6 mb-8 flex justify-between items-start">
        <div className="flex items-center gap-6">
           {personalInfo.photo && (
               <img src={personalInfo.photo} alt={personalInfo.firstName} className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md" />
           )}
            <div>
                <h1 className="text-5xl font-bold uppercase tracking-tight text-gray-900 leading-none">
                    {personalInfo.firstName || "Your"} <span className="text-teal-600">{personalInfo.lastName || "Name"}</span>
                </h1>
                <p className="text-2xl mt-2 text-gray-600 font-light">{personalInfo.jobTitle || "Job Title"}</p>
            </div>
        </div>
        <div className="text-right text-sm text-gray-500 space-y-1 self-center">
             <p>{personalInfo.email || "email@example.com"}</p>
             <p>{personalInfo.phone || "+251 900 000 000"}</p>
             <p>{personalInfo.city && personalInfo.country ? `${personalInfo.city}, ${personalInfo.country}` : "Addis Ababa, Ethiopia"}</p>
        </div>
      </header>

      {/* Main Content */}
       <div className="space-y-8">
            
            {/* Summary */}
            <section>
                <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">Profile</h3>
                <p className="text-gray-700 leading-relaxed">
                    {typeof summary === 'string' && summary ? summary : "Professional summary goes here. Briefly describe your experience and skills."}
                </p>
            </section>
            
             {/* Experience */}
             <section>
                <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">Experience</h3>
                 <div className="space-y-4">
                     {data.experience.map((exp) => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-lg">{exp.jobTitle}</h4>
                                <span className="text-sm text-gray-500">
                                    {exp.startDate} - {exp.endDate || "Present"}
                                </span>
                            </div>
                            <p className="text-teal-600 font-medium text-sm mb-2">{exp.company}</p>
                            {exp.description && (
                                <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                            )}
                        </div>
                     ))}
                     {data.experience.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No experience added yet.</p>
                     )}
                 </div>
            </section>

             {/* Education */}
              <section>
                <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">Education</h3>
                 <div className="space-y-4">
                    {data.education.map((edu) => (
                        <div key={edu.id}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-lg">{edu.school}</h4>
                                <span className="text-sm text-gray-500">
                                    {edu.startDate} - {edu.endDate}
                                </span>
                            </div>
                            <p className="text-teal-600 font-medium text-sm">{edu.degree}</p>
                            {edu.city && <p className="text-xs text-gray-500">{edu.city}</p>}
                        </div>
                    ))}
                     {data.education.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No education added yet.</p>
                     )}
                 </div>
            </section>

            {/* Skills */}
            <section>
                <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-200 pb-1">Skills</h3>
                {data.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                            <span key={skill.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">No skills added yet.</p>
                )}
            </section>
       </div>
    </div>
  )
}
