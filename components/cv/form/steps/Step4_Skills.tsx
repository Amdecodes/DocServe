"use client";

import { useState } from "react";
import { useCV } from "@/components/cv/CVContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { X, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export function Step4_Skills() {
  const { cvData, addItem, removeItem } = useCV();
  const [skillName, setSkillName] = useState("");
  const t = useTranslations("Skills");

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (skillName.trim()) {
      addItem("skills", { 
        id: crypto.randomUUID(), 
        name: skillName.trim(), 
        level: "Intermediate" 
      }) // Default level
      setSkillName("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-gray-500">{t("description")}</p>
      </div>

      <div className="flex flex-wrap gap-2 min-h-25 content-start p-4 bg-white border rounded-lg">
        {cvData.skills.length === 0 && (
          <p className="text-sm text-gray-400 w-full text-center py-4">
            {t("noSkills")}
          </p>
        )}
        {cvData.skills.map((skill) => (
          <Badge
            key={skill.id}
            variant="secondary"
            className="pl-3 pr-1 py-1 text-sm bg-gray-100 hover:bg-gray-200"
          >
            {skill.name}
            <button
              onClick={() => removeItem("skills", skill.id)}
              className="ml-2 rounded-full p-0.5 hover:bg-gray-300 text-gray-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
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
    </div>
  );
}
