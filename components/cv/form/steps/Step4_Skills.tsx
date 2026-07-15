"use client";

import { useState } from "react";
import { useCV } from "@/components/cv/CVContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { X, Plus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { HARD_SKILLS, SOFT_SKILLS } from "@/config/skills";

export function Step4_Skills() {
  const { cvData, addItem, removeItem } = useCV();
  const [skillName, setSkillName] = useState("");
  const t = useTranslations("Skills");

  const handleAdd = (nameText: string) => {
    const trimmed = nameText.trim();
    if (trimmed) {
      // Prevent adding exact duplicate name
      const exists = cvData.skills.some(
        (s) => s.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) return;

      addItem("skills", {
        id: crypto.randomUUID(),
        name: trimmed,
        level: "Intermediate",
      });
      setSkillName("");
    }
  };

  const hardSkillsSuggestions = HARD_SKILLS.filter(
    (s) =>
      !cvData.skills.some((userSkill) => 
        userSkill.name.toLowerCase() === s.toLowerCase()
      )
  ).slice(0, 12);

  const softSkillsSuggestions = SOFT_SKILLS.filter(
    (s) =>
      !cvData.skills.some((userSkill) => 
        userSkill.name.toLowerCase() === s.toLowerCase()
      )
  ).slice(0, 12);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-gray-500">{t("description")}</p>
      </div>

      {/* Manual Entry */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd(skillName);
        }}
        className="flex gap-2"
      >
        <Input
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1"
        />
        <Button type="submit" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> {t("add")}
        </Button>
      </form>

      {/* Suggestions Section */}
      {(hardSkillsSuggestions.length > 0 || softSkillsSuggestions.length > 0) && (
        <div className="space-y-4 bg-gray-50/30 p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Suggestions
          </div>

          {/* Hard Skills */}
          {hardSkillsSuggestions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Hard Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {hardSkillsSuggestions.map((skill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAdd(skill)}
                    className="px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-sm text-gray-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all flex items-center gap-1.5 bg-white"
                  >
                    <Plus className="w-3 h-3" />
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {softSkillsSuggestions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-dashed border-gray-100">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Soft Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {softSkillsSuggestions.map((skill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAdd(skill)}
                    className="px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-sm text-gray-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all flex items-center gap-1.5 bg-white"
                  >
                    <Plus className="w-3 h-3" />
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Skills List */}
      <div className="space-y-3">
         <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Selected Skills
          </div>
        <div className="flex flex-wrap gap-2 min-h-25 content-start p-4 bg-gray-50/50 border border-dashed rounded-lg">
          {cvData.skills.length === 0 && (
            <p className="text-sm text-gray-400 w-full text-center py-4">
              {t("noSkills")}
            </p>
          )}
          {cvData.skills.map((skill) => (
            <Badge
              key={skill.id}
              variant="secondary"
              className="pl-3 pr-1 py-1.5 text-sm bg-white border shadow-sm flex items-center gap-1"
            >
              {skill.name}
              <button
                type="button"
                onClick={() => removeItem("skills", skill.id)}
                className="ml-1 rounded-full p-0.5 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
