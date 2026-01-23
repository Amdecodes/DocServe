"use client";

import { useState } from "react";
import { useCV } from "@/components/cv/CVContext";

type LanguageItem = {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Intermediate" | "Basic";
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Plus, X } from "lucide-react";

export function Languages() {
  const { cvData, updateCVData } = useCV();
  const [newLang, setNewLang] = useState<Partial<LanguageItem>>({
    proficiency: "Professional",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLang.language) {
      const newItem = { ...newLang, id: Date.now().toString() } as LanguageItem;
      updateCVData("languages", [
        ...(cvData.languages || []),
        newItem,
      ] as LanguageItem[]);
      setNewLang({ proficiency: "Professional" });
    }
  };

  const removeLang = (id: string) => {
    updateCVData(
      "languages",
      (cvData.languages || []).filter((l) => l.id !== id) as LanguageItem[],
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Languages</CardTitle>
        <CardDescription>Add languages you speak.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {cvData.languages?.map((lang) => (
            <li
              key={lang.id}
              className="flex justify-between items-center p-2 bg-secondary/10 rounded border"
            >
              <div>
                <span className="font-medium">{lang.language}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({lang.proficiency})
                </span>
              </div>
              <button
                onClick={() => removeLang(lang.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAdd} className="flex gap-2 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium">Language</label>
            <Input
              value={newLang.language || ""}
              onChange={(e) =>
                setNewLang({ ...newLang, language: e.target.value })
              }
              placeholder="e.g. English"
            />
          </div>
          <div className="w-1/3 space-y-1">
            <label className="text-xs font-medium">Proficiency</label>
            <Select
              value={newLang.proficiency}
              onChange={(e) =>
                setNewLang({
                  ...newLang,
                  proficiency: e.target.value as LanguageItem["proficiency"],
                })
              }
            >
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Professional">Professional</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Basic">Basic</option>
            </Select>
          </div>
          <Button type="submit" variant="secondary">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
